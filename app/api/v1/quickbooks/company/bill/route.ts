import { Nango } from '@nangohq/node';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { Invoice_Quickbooks } from '@/interfaces/quickbooks.interfaces';

import { BillSchema } from './constants';
import { Bill, LineItem } from './interfaces';

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  const { userId, file }: { userId: string; file: Invoice_Quickbooks } =
    await req.json();

  if (!userId || !file) {
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

  const bill = preparePayload(file);
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

const preparePayload = (file: Invoice_Quickbooks) => {
  try {
    const lineItems: LineItem[] = file.data.lineItems.map((item) => ({
      DetailType: 'AccountBasedExpenseLineDetail',
      Amount: parseFloat(item.totalAmount),
      AccountBasedExpenseLineDetail: {
        AccountRef: {
          value: item.accountId,
        },
        BillableStatus: item.billable ? 'Billable' : 'NotBillable',
        CustomerRef: {
          value: item.customerId,
        },
      },
      Description: item.description,
    }));

    const bill: Bill = {
      Line: lineItems,
      VendorRef: {
        value: file.data.vendorId,
      },
      TxnDate: file.data.date,
      DueDate: file.data.dueDate,
      CurrencyRef: {
        value: 'USD', // Assuming the currency is USD; replace if needed
      },
      PrivateNote:
        file.data.notes + '\n\n' + file.file_url + '\n\n Filed by Workman',
      DocNumber: file.data.invoiceNumber,
    };

    BillSchema.parse(bill);

    return bill;
  } catch (e: unknown) {
    throw new Error('The file is incomplete or invalid');
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
