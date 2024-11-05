import { StatusCodes } from 'http-status-codes';
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
  const userId = req.nextUrl.searchParams.get('userId');
  const labelId = params.id;

  if (!userId) {
    return badRequest('User ID is required');
  }

  try {
    const googleMailToken = await getGmailToken(userId);

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
