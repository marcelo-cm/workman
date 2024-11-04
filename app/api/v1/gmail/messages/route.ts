import { Nango } from '@nangohq/node';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import {
  badRequest,
  internalServerError,
  invalidResponseError,
  ok,
  unauthorized,
} from '@/app/api/utils';
import { Header, Message, MessagePart } from '@/interfaces/gmail.interfaces';
import { base64Decode } from '@/lib/utils';
import { getGmailToken } from '@/lib/utils/nango/google.server';

import { MessagesListResponse } from './interfaces';

export type Email = {
  id: string;
  subject: string;
  date: string;
  from: string;
  attachments: PDFData[];
  labelIds: string[];
};

export interface PDFData {
  base64: string;
  filename: string;
  bufferData: Buffer;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const searchParams = await req.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return badRequest('User ID is required');
  }

  try {
    const googleMailToken = await getGmailToken(userId);

    if (!googleMailToken) {
      return unauthorized('Google Mail token not found');
    }

    const emailsFetched = await getMailIds(String(googleMailToken));

    const emails: Email[] = [];
    for (const email of emailsFetched) {
      const newEmail = await getPDFAndSubject(
        email.id,
        String(googleMailToken),
      );
      emails.push(newEmail);
    }

    return ok(emails);
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to fetch emails');
  }
}

const getMailIds = async (token: string) => {
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  const after = date.toISOString().split('T')[0].replace(/-/g, '/');

  const query = `filename:pdf after:${after} has:attachment filename:pdf smaller:10M label:inbox -label:WORKMAN_SCANNED -label:WORKMAN_IGNORE`;
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw await invalidResponseError('Failed to fetch email IDs', response);
  }

  if (response.status === StatusCodes.NO_CONTENT) {
    return [];
  }

  const data: MessagesListResponse = await response.json();

  return data.messages;
};

const getPDFAndSubject = async (
  emailId: string,
  token: string,
): Promise<Email> => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw await invalidResponseError('Failed to fetch email', response);
  }

  const data: Message = await response.json();

  const { subject, date, from } = parseEmailHeaders(data.payload.headers);
  const attachments = await getPdfAttachmentData(data.payload.parts, token);

  return {
    id: emailId,
    subject,
    date,
    from,
    attachments,
    labelIds: data.labelIds,
  };
};

const parseEmailHeaders = (
  headers: Header[],
): { subject: string; date: string; from: string } => {
  const subject =
    headers.find((header) => header.name === 'Subject')?.value || '';
  const date = headers.find((header) => header.name === 'Date')?.value || '';
  const from = headers.find((header) => header.name === 'From')?.value || '';

  return { subject, date, from };
};

const getPdfAttachmentData = async (
  parts: MessagePart[],
  token: string,
): Promise<PDFData[]> => {
  const attachments: PDFData[] = [];

  const extractAttachmentData = async (parts: MessagePart[], token: string) => {
    if (!parts) {
      return;
    }
    for (const part of parts) {
      if (part.mimeType === 'application/pdf' && part.body?.attachmentId) {
        const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/attachments/${part.body.attachmentId}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch attachment: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        const decodedBase64 = base64Decode(data.data, part.filename);

        const rawBase64 = data.data;
        const base64repaired = rawBase64.replace(/-/g, '+').replace(/_/g, '/');

        attachments.push({
          base64: base64repaired,
          filename: decodedBase64.filename,
          bufferData: decodedBase64.bufferData,
        });
      }
      if (part.parts) {
        extractAttachmentData(part.parts, token);
      }
    }
  };

  await extractAttachmentData(parts, token);
  return attachments;
};
