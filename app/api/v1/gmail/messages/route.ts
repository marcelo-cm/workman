import { NextRequest, NextResponse } from 'next/server';

import {
  badRequest,
  internalServerError,
  invalidResponseError,
  ok,
  unauthorized,
} from '@/app/api/utils';
import { MimeTypes } from '@/constants/enums';
import {
  Header,
  Message,
  MessageHeaderName,
  MessagePart,
  MessagePartBody,
  Message_Partial,
} from '@/interfaces/gmail.interfaces';
import { getGmailToken } from '@/lib/utils/nango/google.server';
import {
  WORKMAN_IGNORE_LABEL_NAME,
  WORKMAN_PROCESSED_LABEL_NAME,
} from '@/models/GmailIntegration';

import { Email, ExtractedPDFData, MessagesListResponse } from './interfaces';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const searchParams = await req.nextUrl.searchParams;
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return badRequest('User ID is required');
  }

  try {
    const googleMailToken = await getGmailToken(companyId);

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

const getMailIds = async (token: string): Promise<Message_Partial[]> => {
  // Get date 6 months prior to current date in YYYY/MM/DD format
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  const after = date.toISOString().slice(0, 10).replace(/-/g, '/');

  const query = `filename:pdf after:${after} has:attachment smaller:10M label:Inbox -label:${WORKMAN_IGNORE_LABEL_NAME} -label:${WORKMAN_PROCESSED_LABEL_NAME} LIMIT`;
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=5`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw await invalidResponseError('Failed to fetch email IDs', response);
  }

  const data: MessagesListResponse = await response.json();

  return data.messages ?? [];
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
  let subject = '';
  let date = '';
  let from = '';

  for (const header of headers) {
    if (header.name === MessageHeaderName.Subject) subject = header.value;
    else if (header.name === MessageHeaderName.Date) date = header.value;
    else if (header.name === MessageHeaderName.From) from = header.value;

    if (subject && date && from) break;
  }

  return { subject, date, from };
};

const getPdfAttachmentData = async (
  parts: MessagePart[],
  token: string,
): Promise<ExtractedPDFData[]> => {
  const attachments: ExtractedPDFData[] = [];

  const extractAttachmentData = async (parts: MessagePart[], token: string) => {
    for (const part of parts) {
      if (part.mimeType === MimeTypes['.pdf'] && part.body?.attachmentId) {
        const attachmentId = part.body.attachmentId;
        const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/attachments/${attachmentId}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw await invalidResponseError(
            'Failed to fetch attachment',
            response,
          );
        }

        const data: MessagePartBody = await response.json();

        if (!data.data) {
          throw new Error('Attachment data not found');
        }

        const rawBase64 = data.data;

        const base64repaired = rawBase64.replace(/-/g, '+').replace(/_/g, '/');

        attachments.push({
          base64: base64repaired,
          fileName: part.filename,
          size: data.size,
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
