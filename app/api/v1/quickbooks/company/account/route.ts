import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { badRequest, internalServerError, unauthorized } from '@/app/api/utils';
import {
  getQuickBooksRealmId,
  getQuickBooksToken,
} from '@/lib/utils/nango/quickbooks.server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const select = searchParams.get('select');
  const where = searchParams.get('where');

  if (!userId || !select) {
    return badRequest('User ID and columns to select are required.');
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

    const accountList = await getAccountList(
      quickbooksRealmId,
      String(quickbooksToken),
      select,
      where,
    );

    return new NextResponse(JSON.stringify(accountList), {
      status: StatusCodes.OK,
    });
  } catch (e: unknown) {
    console.error(e);
    return internalServerError(`Failed to fetch account: ${String(e)}`);
  }
}

const getAccountList = async (
  realmId: string,
  token: string,
  columns: string,
  where: string | null,
) => {
  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=select ${columns} from Account ${where ? `where ${where}` : ''}`;

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
