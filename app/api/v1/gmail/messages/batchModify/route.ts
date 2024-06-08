import { Nango } from "@nangohq/node";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, emailIds, addLabelIds, removeLabelIds } = await req.json();

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

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/batchModify`;
    const body = {
      ids: emailIds,
      addLabelIds,
      removeLabelIds,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${googleMailToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch emails: ${response.status} ${response.statusText}`,
      );
    }

    return new NextResponse(JSON.stringify(response), {
      status: StatusCodes.OK,
    });
  } catch (e: unknown) {
    console.error(e);
    return new NextResponse(JSON.stringify("Internal Server Error"), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
