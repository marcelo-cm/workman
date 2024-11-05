import { NextRequest, NextResponse } from 'next/server';

import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '@/app/api/utils';
import { getGmailToken } from '@/lib/utils/nango/google.server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const companyId = req.nextUrl.searchParams.get('companyId');
  const labelId = params.id;

  if (!companyId || !labelId) {
    return badRequest('User ID is required');
  }

  try {
    const googleMailToken = await getGmailToken(companyId);

    if (!googleMailToken) {
      return unauthorized('Google Mail token not found');
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/labels/${labelId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${googleMailToken}`,
      },
    });

    const data = await response.json();

    return ok(data);
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to get label');
  }
}
