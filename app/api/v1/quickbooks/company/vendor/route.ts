import { Nango } from '@nangohq/node';
import { NextRequest } from 'next/server';

import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '@/app/api/utils';
import { Vendor } from '@/interfaces/quickbooks.interfaces';
import {
  getQuickBooksRealmId,
  getQuickBooksToken,
} from '@/lib/utils/nango/quickbooks.server';

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const select = searchParams.get('select');
  const where = searchParams.get('where');

  if (!(userId && select)) {
    return badRequest('User ID and select columns are required');
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

    console.log('%c ---- select', 'color: #b0c4de', select, '----');

    const vendorList = await getVendorList(
      quickbooksRealmId,
      String(quickbooksToken),
      select,
      where,
    );

    return ok(vendorList);
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to fetch vendor list');
  }
}

const getVendorList = async (
  realmId: string,
  token: string,
  columns: string,
  where: string | null,
) => {
  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=select ${columns} from vendor ${where ? `${where}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `${response.status}: Failed to fetch vendor list, ${errorText}`,
    );
  }

  const data: Vendor[] = await response.json();

  return data;
};
