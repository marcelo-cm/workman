import { StatusCodes } from "http-status-codes";
import { Nango } from "@nangohq/node";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const userId = await req.nextUrl.searchParams.get("userId");
    // const userId = req.query;

    console.log("User ID:", userId);

    // if (!userId) {
    //   console.log("User ID is missing");
    //   return new NextResponse("User ID is required", {
    //     status: StatusCodes.BAD_REQUEST,
    //   });
    // }

    // const googleMailToken = await nango.getToken("google-mail", userId);

    // if (!googleMailToken) {
    //   console.log("No token found");
    //   return new NextResponse("Unauthorized", {
    //     status: StatusCodes.UNAUTHORIZED,
    //   });
    // }

    // console.log("Token retrieved:", googleMailToken);
    // const emails = await getMail(String(googleMailToken));
    // console.log("Emails retrieved:", emails);

    // return new NextResponse(JSON.stringify(emails), {
    //   status: StatusCodes.OK,
    // });

    return new NextResponse("OK", {
      status: StatusCodes.OK,
    });
  } catch (e: unknown) {
    console.error(e);
    return new NextResponse("Internal Server Error", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

const getMail = async (token: string) => {
  const url =
    "https://www.googleapis.com/gmail/v1/users/me/messages?q=has:attachment";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log(
      "Failed to fetch emails:",
      response.status,
      response.statusText,
    );
    throw new Error(
      `Failed to fetch emails: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  console.log(data);

  return data.messages;
};
