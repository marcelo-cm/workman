import { NextRequest } from 'next/server';

import { badRequest, internalServerError, ok } from '@/app/api/utils';
import {
  getQuickBooksRealmId,
  getQuickBooksToken,
} from '@/lib/utils/nango/quickbooks.server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return badRequest('Company ID is required.');
  }

  try {
    const quickbooksToken = await getQuickBooksToken(companyId);
    const quickbooksRealmId = await getQuickBooksRealmId(companyId);

    return ok({
      quickbooksToken: !!quickbooksToken,
      quickbooksRealmId: !!quickbooksRealmId,
    });
  } catch (e: unknown) {
    console.error(e);
    return internalServerError(
      `Failed to get QuickBooks healthcheck: ${String(e)}`,
    );
  }
}
