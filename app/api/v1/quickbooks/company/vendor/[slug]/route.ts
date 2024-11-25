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

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const searchParams = req.nextUrl.searchParams;
  const vendorId = params.slug;
  const companyId = searchParams.get('companyId');

  if (!(companyId && vendorId)) {
    return badRequest('User ID and vendor ID are required');
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

    const vendor = await getVendor(
      quickbooksRealmId,
      String(quickbooksToken),
      vendorId,
    );

    return ok(vendor);
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to fetch vendor');
  }
}

const getVendor = async (
  realmId: string,
  token: string,
  vendorId: string,
): Promise<any> => {
  console.log('--- FETCHING VENDOR ---');
  const response = await fetch(
    `https://quickbooks.api.intuit.com/v3/company/${realmId}/vendor/${vendorId}?minorversion=73`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `${response.status}: Failed to fetch vendor list, ${errorText}`,
    );
  }

  const responseData: Vendor = await response.json();

  return responseData;
};
