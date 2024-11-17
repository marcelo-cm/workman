import { NextRequest, NextResponse } from 'next/server';

import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '@/app/api/utils';
import { Label, Label_Basic } from '@/interfaces/gmail.interfaces';
import { getGmailToken } from '@/lib/utils/nango/google.server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const companyId = req.nextUrl.searchParams.get('companyId');

  if (!companyId) {
    return badRequest('User ID is required');
  }

  try {
    const googleMailToken = await getGmailToken(companyId);

    if (!googleMailToken) {
      return unauthorized('Google Mail token not found');
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/labels`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${googleMailToken}`,
      },
    });

    const data = await response.json();

    return ok(data);
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to get labels');
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const {
    companyId,
    label,
  }: { companyId: string; label: Omit<Label_Basic, 'id'> } = await req.json();

  if (!companyId || !label) {
    return badRequest('User ID and label are required');
  }

  try {
    const googleMailToken = await getGmailToken(companyId);

    if (!googleMailToken) {
      return unauthorized('Google Mail token not found');
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/labels`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${googleMailToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(label),
    });

    const data: Label = await response.json();

    return ok(data);
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to create label');
  }
}
