import { Connection, Nango } from '@nangohq/node';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { Vendor } from '@/interfaces/quickbooks.interfaces';

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const vendorId = params.slug;

  try {
    if (!userId || !vendorId) {
      return new NextResponse(
        JSON.stringify('User ID, Vendor ID, and Select are all required'),
        {
          status: StatusCodes.BAD_REQUEST,
        },
      );
    }

    const quickbooksToken = await nango.getToken('quickbooks', userId);
    const quickbooksConnection: Connection = await nango.getConnection(
      'quickbooks',
      userId,
    );

    const quickbooksRealmId = quickbooksConnection?.connection_config.realmId;

    console.log('QuickBooks Realm ID:', quickbooksRealmId);

    if (!quickbooksRealmId) {
      return new NextResponse(JSON.stringify('QuickBooks not authorized'), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const vendor = await getVendor(
      quickbooksRealmId,
      String(quickbooksToken),
      vendorId,
    );

    console.log(vendor);

    return new NextResponse(JSON.stringify(vendor), {
      status: StatusCodes.OK,
    });
  } catch (e: unknown) {
    console.error(e);
    return new NextResponse(JSON.stringify('Internal Server Error'), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

const getVendor = async (
  realmId: string,
  token: string,
  vendorId: string,
): Promise<any> => {
  const response = await fetch(
    `https://quickbooks.api.intuit.com/v3/company/${realmId}/vendor/${vendorId}?minorversion=73`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      'Failed to fetch vendor list:',
      response.status,
      response.statusText,
      errorText,
    );
    return null;
  }

  const responseData: Vendor = await response.json();

  return responseData;
};
