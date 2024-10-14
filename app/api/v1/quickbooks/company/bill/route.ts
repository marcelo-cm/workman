import { Nango } from '@nangohq/node';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { InvoiceData, InvoiceLineItem } from '@/interfaces/common.interfaces';
import { Account, Customer, Vendor } from '@/interfaces/quickbooks.interfaces';
import Invoice from '@/models/Invoice';

import { BillSchema, LineItemSchema } from './constants';
import { Bill, LineItem } from './interfaces';

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

interface LineItemWithMatchedAccount
  extends Omit<InvoiceLineItem, 'productCode'> {
  productCode: Account;
}

interface InvoiceDataWithMatchedValues extends Omit<InvoiceData, 'lineItems'> {
  lineItems: LineItemWithMatchedAccount[];
}

/**
 * Invoice with matched values,
 */
interface InvoiceWithMatchedValues
  extends Omit<Invoice, 'data' | 'supplierName' | 'customerAddress'> {
  data: InvoiceDataWithMatchedValues;
  _file_url: string;
  supplierName: Vendor;
  customerAddress: Customer;
}

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

  const { realmId, token } = await getCredentials(userId);

  if (!realmId || !token) {
    return new NextResponse(JSON.stringify('QuickBooks not authorized'), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const bill = preparePayload(invoice);
  const response = await sendBillToQuickBooks(realmId, String(token), bill);

  return new NextResponse(JSON.stringify(response), {
    status: StatusCodes.OK,
  });
}

const getCredentials = async (userId: string) => {
  const token = await nango.getToken('quickbooks', userId);
  const connection = await nango.getConnection('quickbooks', userId);
  const realmId = connection?.connection_config.realmId;

  if (!token || !realmId) {
    return { token: undefined, realmId: undefined };
  }

  return { token, realmId };
};

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
    console.error(
      'Failed to create bill in QuickBooks:',
      response.status,
      response.statusText,
      errorText,
    );
    return [];
  }

  const data = await response.json();
  return data;
};
