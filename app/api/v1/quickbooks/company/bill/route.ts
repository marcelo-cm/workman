import { Connection, Nango } from '@nangohq/node';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { Invoice_Quickbooks } from '@/interfaces/quickbooks.interfaces';

import { BillSchema, LineItemSchema } from './constants';
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

  const quickbooksToken = await nango.getToken('quickbooks', userId);
  const quickbooksConnection: Connection = await nango.getConnection(
    'quickbooks',
    userId,
  );

  const quickbooksRealmId = quickbooksConnection?.connection_config.realmId;

  if (!quickbooksRealmId) {
    return new NextResponse(JSON.stringify('QuickBooks not authorized'), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  // Upload the file to QuickBooks
  const response = await createBillInQuickBooks(
    quickbooksRealmId,
    String(quickbooksToken),
    file,
  );

  return new NextResponse(JSON.stringify(response), {
    status: StatusCodes.OK,
  });
}

const createBillInQuickBooks = async (
  realmId: string,
  token: string,
  file: Invoice_Quickbooks,
) => {
  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/bill`;

  try {
    const lineItems: LineItem[] = file.data.lineItems.map((item) => ({
      DetailType: 'AccountBasedExpenseLineDetail',
      Amount: parseFloat(item.totalAmount),
      AccountBasedExpenseLineDetail: {
        AccountRef: {
          value: item.accountId, // 63 is hardcoded for, Job Expenses:Job Materials
        },
        BillableStatus: item.billable ? 'Billable' : 'NotBillable',
        CustomerRef: {
          value: item.customerId,
        },
      },
      Description: item.description,
    }));

    lineItems.forEach((lineItem) => LineItemSchema.parse(lineItem));

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
  } catch (e: unknown) {
    throw new Error(`Failed to create bill in QuickBooks`);
  }
};
