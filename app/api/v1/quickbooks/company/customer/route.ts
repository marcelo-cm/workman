import { Connection, Nango } from '@nangohq/node';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { badRequest, internalServerError, unauthorized } from '@/app/api/utils';
import {
  getQuickBooksRealmId,
  getQuickBooksToken,
} from '@/lib/utils/nango/quickbooks.server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const companyId = searchParams.get('companyId');
  const select = searchParams.get('select');
  const where = searchParams.get('where');

  if (!companyId || !select) {
    return badRequest('User ID and columns to select are required.');
  }

  try {
    const quickbooksToken = await getQuickBooksToken(companyId);

    if (!quickbooksToken) {
      return unauthorized('QuickBooks token not found');
    }

    const quickbooksRealmId = await getQuickBooksRealmId(companyId);

    if (!quickbooksRealmId) {
      return unauthorized('QuickBooks realm ID not found');
    }

    const vendorList = await getCustomerList(
      quickbooksRealmId,
      String(quickbooksToken),
      select,
      where,
    );

    return new NextResponse(JSON.stringify(vendorList), {
      status: StatusCodes.OK,
    });
  } catch (e: unknown) {
    console.error(e);
    return internalServerError(`Failed to fetch account: ${String(e)}`);
  }
}

const getCustomerList = async (
  realmId: string,
  token: string,
  columns: string,
  where: string | null,
) => {
  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=select ${columns} from Customer ${where ? `where ${where}` : ''}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
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
