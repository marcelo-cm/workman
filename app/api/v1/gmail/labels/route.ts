import { Header, Message, MessagePart } from "@/interfaces/gmail.interfaces";
import { base64Decode } from "@/lib/utils";
import { Nango } from "@nangohq/node";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

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

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/labels`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${googleMailToken}`,
      },
    });

    const data = await response.json();
    console.log(data);

    return new NextResponse(JSON.stringify(data.labels), {
      status: StatusCodes.OK,
    });
  } catch (e: unknown) {
    console.error(e);
    return new NextResponse(JSON.stringify("Internal Server Error"), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function POST(req: NextRequest) {
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
  } catch (e: unknown) {
    console.error(e);
    return new NextResponse(JSON.stringify("Internal Server Error"), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

const batchModifyLabels = async (
  ids: string[],
  addLabel: string[],
  removeLabels: string[],
  token: string,
) => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/batchModify`;
  const body = { ids, addLabelIds: addLabel, removeLabelIds: removeLabels };
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
};
