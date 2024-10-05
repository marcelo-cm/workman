import { NextRequest } from 'next/server';

import { badRequest, internalServerError, ok } from '@/app/api/utils';
import { Customer, Vendor } from '@/interfaces/quickbooks.interfaces';
import {
  getQuickBooksRealmId,
  getQuickBooksToken,
} from '@/lib/utils/nango/quickbooks.server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return badRequest('User ID is required');
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

    const customers = await getAllVendors(
      quickbooksRealmId,
      String(quickbooksToken),
    );

    return ok(customers);
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to fetch all customers');
  }
}

const getAllVendors = async (realmId: string, token: string): Promise<any> => {
  console.log('--- FETCHING ALL VENDORS ---');

  let hasMore = true;
  let startPosition = 1;
  let maxResults = 1000;
  let page = `startPosition ${startPosition} maxResults ${maxResults}`;

  let customers: Partial<Customer>[] = [];

  while (hasMore) {
    const response = await fetch(
      `https://quickbooks.api.intuit.com/v3/company/${realmId}/query?query=select Id, DisplayName from Customer ${page}`,
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

    customers = [...customers, ...responseData.QueryResponse.Customer];

    if (responseData.QueryResponse.maxResults === maxResults) {
      startPosition += maxResults;
      page = `startPosition ${startPosition} maxResults ${maxResults}`;
    } else {
      hasMore = false;
    }
  }

  return customers;
};
