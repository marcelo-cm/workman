import { StatusCodes } from "http-status-codes";
import { Nango } from "@nangohq/node";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

type Email = {
  subject: string;
  date: string;
  from: string;
  attachments: string[];
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const userId = await req.nextUrl.searchParams.get("userId");

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

    const emailsFetched = await getMail(String(googleMailToken));

    const emails: Email[] = [];
    for (const email of emailsFetched) {
      const { subject, date, from, attachments } = await getPDFAndSubject(
        email.id,
        String(googleMailToken),
      );
      emails.push({ subject, date, from, attachments });
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

const getMail = async (token: string) => {
  const url =
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=has:attachment";
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

  const data = await response.json();

  return data.messages;
};

const getPDFAndSubject = async (emailId: string, token: string) => {
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

  const data = await response.json();

  const { subject, date, from } = parseEmailHeaders(data.payload.headers);
  const attachments = await getPdfAttachmentIds(data.payload.parts, token);

  return { subject, date, from, attachments };
};

const parseEmailHeaders = (
  headers: { name: string; value: string }[],
): { subject: string; date: string; from: string } => {
  const subject =
    headers.find((header) => header.name === "Subject")?.value || "";
  const date = headers.find((header) => header.name === "Date")?.value || "";
  const from = headers.find((header) => header.name === "From")?.value || "";
  return { subject, date, from };
};

const getPdfAttachmentIds = async (
  parts: any[],
  token: string,
): Promise<string[]> => {
  const attachmentIds: any[] = [];

  const extractAttachmentIds = async (parts: any[], token: string) => {
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
        attachmentIds.push(data);
      }
      if (part.parts) {
        extractAttachmentIds(part.parts, token);
      }
    }
  };

  await extractAttachmentIds(parts, token);
  return attachmentIds;
};
