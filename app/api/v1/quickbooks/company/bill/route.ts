import { NextRequest } from 'next/server';

import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '@/app/api/utils';
import {
  getQuickBooksRealmId,
  getQuickBooksToken,
} from '@/lib/utils/nango/quickbooks.server';

import { BillSchema } from './constants';
import { Bill, InvoiceWithMatchedValues, LineItem } from './interfaces';

export async function POST(req: NextRequest) {
  const {
    userId,
    invoice,
  }: { userId: string; invoice: InvoiceWithMatchedValues } = await req.json();

  if (!userId || !invoice) {
    return badRequest('User ID and Invoice are required.');
  }

  try {
    const quickbooksToken = await getQuickBooksToken(userId);

    if (!quickbooksToken) {
      return unauthorized('QuickBooks token not found');
    }

    const quickbooksRealmId = await getQuickBooksRealmId(userId);

    if (!quickbooksRealmId) {
      return unauthorized('QuickBooks realm ID not found');
    }
    const bill = preparePayload(invoice);
    const billResponse = await sendBillToQuickBooks(
      quickbooksRealmId,
      String(quickbooksToken),
      bill,
    );
    const attachmentBase64 = await getBase64FromURL(invoice._file_url);

    debugger;
    const attachmentResponse = await sendAttachableToQuickBooks(
      quickbooksRealmId,
      String(quickbooksToken),
      attachmentBase64 as string,
      billResponse.Bill.Id,
      invoice.fileName,
    );

    return ok(billResponse);
  } catch (e: unknown) {
    console.log(e);
    return internalServerError('Failed to upload bill to QuickBooks');
  }
}

const preparePayload = (invoice: InvoiceWithMatchedValues) => {
  try {
    const lineItems: LineItem[] = invoice.data.lineItems.map((item) => ({
      DetailType: 'AccountBasedExpenseLineDetail',
      Amount: parseFloat(item.totalAmount),
      AccountBasedExpenseLineDetail: {
        AccountRef: {
          value: item?.productCode?.Id ?? '',
        },
        BillableStatus: item.billable ? 'Billable' : 'NotBillable',
        CustomerRef: {
          value: invoice.customerAddress.Id,
        },
      },
      Description: item.description,
    }));

    const bill: Bill = {
      Line: lineItems,
      VendorRef: {
        value: invoice.supplierName.Id,
      },
      TxnDate: invoice.data.date,
      DueDate: invoice.data.dueDate,
      CurrencyRef: {
        value: 'USD', // Assuming the currency is USD; replace if needed
      },
      PrivateNote:
        invoice.data.notes +
        '\n\n' +
        invoice._file_url +
        '\n\n Filed by Workman',
      DocNumber: invoice?.invoiceNumber ?? '',
    };

    BillSchema.parse(bill);

    return bill;
  } catch (e: unknown) {
    console.log(e);
    throw new Error(`The file is incomplete or invalid, ${String(e)}`);
  }
};

const sendBillToQuickBooks = async (
  realmId: string,
  token: string,
  bill: Bill,
) => {
  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/bill`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(bill),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `${response.status}: Failed to fetch customer list, ${errorText}`,
    );
  }

  const data = await response.json();
  return data;
};

const sendAttachableToQuickBooks = async (
  realmId: string,
  token: string,
  base64: string,
  attachableId: string,
  attachableName: string,
) => {
  console.log('Attaching file to QuickBook Bill');

  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/upload`;

  // Create a FormData object to handle the multipart/form-data request
  const form = new FormData();

  // Convert base64 to binary Blob
  const binaryData = Buffer.from(base64, 'base64');
  const blob = new Blob([binaryData], { type: 'application/pdf' });

  form.append('file', blob, attachableName);
  form.append(
    'AttachableRef',
    JSON.stringify([
      {
        EntityRef: {
          type: 'Bill',
          value: attachableId,
        },
      },
    ]),
  );
  form.append('ContentType', 'application/pdf');
  form.append('FileName', attachableName);

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Accept', 'application/json');

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: form,
  });

  const responseData = await response.json();
  console.log('Attachable Response', responseData);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `${response.status}: Failed to attach PDF to Bill, ${errorText}`,
    );
  }

  return responseData;
};

const getBase64FromURL = async (invoiceURL: string) => {
  const response = await fetch(invoiceURL);
  if (!response.ok) {
    throw new Error(`Failed to fetch the PDF: ${response.statusText}`);
  }

  // Convert the response into an ArrayBuffer
  const arrayBuffer = await response.arrayBuffer();

  // Convert the ArrayBuffer to a base64 string using Buffer
  const base64String = Buffer.from(arrayBuffer).toString('base64');

  return base64String;
};
