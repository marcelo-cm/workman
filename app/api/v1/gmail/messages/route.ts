import { Header, Message, MessagePart } from "@/interfaces/gmail.interfaces";
import { base64Decode } from "@/lib/utils";
import { Nango } from "@nangohq/node";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

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
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return new NextResponse(JSON.stringify("User ID is required"), {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const googleMailToken = await nango.getToken("google-mail", userId);

    if (!googleMailToken) {
      return new NextResponse(JSON.stringify("Unauthorized"), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const emailsFetched = await getMailIds(String(googleMailToken));

    if (!emailsFetched) {
      // No emails found — so cannot iterate over them
      return new NextResponse(JSON.stringify([]), {
        status: StatusCodes.OK,
      });
    }

    const emails: Email[] = [];
    for (const email of emailsFetched) {
      const newEmail = await getPDFAndSubject(
        email.id,
        String(googleMailToken),
      );
      emails.push(newEmail);
    }

    return new NextResponse(JSON.stringify(emails), {
      status: StatusCodes.OK,
    });
  } catch (e: unknown) {
    console.error(e);
    return new NextResponse(JSON.stringify("Internal Server Error"), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

const getMailIds = async (token: string) => {
  const url =
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=has:attachment AND NOT in:WORKMAN SCANNED AND NOT in:WORKMAN IGNORE";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch emails: ${response.status} ${response.statusText}`,
    );
  }

  if (response.status === 204) {
    return;
  }

  const data: {
    messages: { id: string; threadId: string; labelIds: string[] }[];
    resultSizeEstimate: number;
  } = await response.json();

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
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch email: ${response.status} ${response.statusText}`,
    );
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
    headers.find((header) => header.name === "Subject")?.value || "";
  const date = headers.find((header) => header.name === "Date")?.value || "";
  const from = headers.find((header) => header.name === "From")?.value || "";

  return { subject, date, from };
};

const getPdfAttachmentData = async (
  parts: MessagePart[],
  token: string,
): Promise<PDFData[]> => {
  const attachments: PDFData[] = [];

  const extractAttachmentData = async (parts: MessagePart[], token: string) => {
    for (const part of parts) {
      if (part.mimeType === "application/pdf" && part.body?.attachmentId) {
        const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/attachments/${part.body.attachmentId}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch attachment: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        const decodedBase64 = base64Decode(data.data, part.filename);

        const rawBase64 = data.data;
        const base64repaired = rawBase64.replace(/-/g, "+").replace(/_/g, "/");

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
