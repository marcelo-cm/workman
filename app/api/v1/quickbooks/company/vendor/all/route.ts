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

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return badRequest('User ID is required');
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

    const vendors = await getAllVendors(
      quickbooksRealmId,
      String(quickbooksToken),
    );

    return ok(vendors);
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to fetch all vendors');
  }
}

const getAllVendors = async (realmId: string, token: string): Promise<any> => {
  console.log('--- FETCHING ALL VENDORS ---');

  let hasMore = true;
  let startPosition = 1;
  let maxResults = 1000;
  let page = `startPosition ${startPosition} maxResults ${maxResults}`;

  let vendors: Vendor[] = [];

  while (hasMore) {
    const response = await fetch(
      `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=select Id, DisplayName from vendor ${page}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        next: {
          revalidate: 600,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `${response.status}: Failed to fetch vendor list, ${errorText}`,
      );
    }

    const responseData = await response.json();

    vendors = [...vendors, ...responseData.QueryResponse.Vendor];

    if (responseData.QueryResponse.maxResults === maxResults) {
      startPosition += maxResults;
      page = `startPosition ${startPosition} maxResults ${maxResults}`;
    } else {
      hasMore = false;
    }
  }

  return vendors;
};
