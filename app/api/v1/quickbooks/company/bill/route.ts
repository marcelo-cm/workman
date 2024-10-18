import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { internalServerError, ok } from '@/app/api/utils';
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
    return new NextResponse(
      JSON.stringify({ message: 'User ID and File are required' }),
      {
        status: StatusCodes.BAD_REQUEST,
      },
    );
  }

  try {
    const quickbooksToken = await getQuickBooksToken(userId);

    if (!quickbooksToken) {
      return internalServerError('QuickBooks token not found');
    }

    const quickbooksRealmId = await getQuickBooksRealmId(userId);

    if (!quickbooksRealmId) {
      return internalServerError('QuickBooks realm ID not found');
    }

    const bill = preparePayload(invoice);
    const response = await sendBillToQuickBooks(
      quickbooksRealmId,
      String(quickbooksToken),
      bill,
    );

    return ok(response);
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
          value: item?.productCode.Id ?? '',
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
    throw new Error(`The file is incomplete or invalid, ${String(e)}`);
  }
};

const sendBillToQuickBooks = async (
  realmId: string,
  token: string,
  bill: Bill,
) => {
  console.log('Sending bill to QuickBooks:', bill);

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
