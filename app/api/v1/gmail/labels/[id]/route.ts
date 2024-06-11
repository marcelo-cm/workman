import { Nango } from '@nangohq/node';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const labelId = params.id;

    if (!userId) {
      return new NextResponse(JSON.stringify('User ID is required'), {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const googleMailToken = await nango.getToken('google-mail', userId);

    if (!googleMailToken) {
      return new NextResponse(JSON.stringify('Unauthorized'), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/labels/${labelId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${googleMailToken}`,
      },
    });

    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
      status: StatusCodes.OK,
    });
  } catch (e: unknown) {
    console.error(e);
    return new NextResponse(JSON.stringify('Internal Server Error'), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
