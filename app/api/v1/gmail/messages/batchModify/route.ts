import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import {
  badRequest,
  internalServerError,
  invalidResponseError,
  noContent,
  ok,
  unauthorized,
} from '@/app/api/utils';
import { getGmailToken } from '@/lib/utils/nango/google.server';

import { BatchModifyPostBody } from '../interfaces';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { companyId, emailIds, addLabelIds, removeLabelIds } = await req.json();

  if (!companyId) {
    return badRequest('User ID is required');
  }

  try {
    const googleMailToken = await getGmailToken(companyId);

    if (!googleMailToken) {
      return unauthorized('Google Mail token not found');
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/batchModify`;
    const body: BatchModifyPostBody = {
      ids: emailIds,
      addLabelIds,
      removeLabelIds,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${googleMailToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw await invalidResponseError(
        'Failed to batch modify labels',
        response,
      );
    }

    return noContent();
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to batch modify labels');
  }
}
