import { Nango } from '@nangohq/node';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { Bill } from '../bill/interfaces';

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  const { companyId, bill }: { companyId: string; bill: Bill } =
    await req.json();

  if (!companyId || !bill) {
    return new NextResponse(
      JSON.stringify({ message: 'User ID and File are required' }),
      {
        status: StatusCodes.BAD_REQUEST,
      },
    );
  }

  const { realmId, token } = await getCredentials(companyId);

  if (!realmId || !token) {
    return new NextResponse(JSON.stringify('QuickBooks not authorized'), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const response = await sendBillToQuickBooks(realmId, String(token), bill);

  return new NextResponse(JSON.stringify(response), {
    status: StatusCodes.OK,
  });
}

const getCredentials = async (companyId: string) => {
  const token = await nango.getToken('quickbooks', companyId);
  const connection = await nango.getConnection('quickbooks', companyId);
  const realmId = connection?.connection_config.realmId;

  if (!token || !realmId) {
    return { token: undefined, realmId: undefined };
  }

  return { token, realmId };
};

const sendBillToQuickBooks = async (
  realmId: string,
  token: string,
  bill: Bill,
) => {
  const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/bill`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(bill),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      'Failed to create bill in QuickBooks:',
      response.status,
      response.statusText,
      errorText,
    );
    return [];
  }

  const data = await response.json();
  return data;
};
