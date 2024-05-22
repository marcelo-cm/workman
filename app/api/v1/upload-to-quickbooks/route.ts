import { NextRequest, NextResponse } from "next/server";
import { Nango, Connection } from "@nangohq/node";
import { StatusCodes } from "http-status-codes";

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body) {
    return new NextResponse(JSON.stringify({ message: "Body is required" }), {
      status: 400,
    });
  }

  const { userId, file } = body;

  const quickbooksToken = await nango.getToken("quickbooks", userId);
  const quickbooksConnection: Connection = await nango.getConnection(
    "quickbooks",
    userId,
  );

  const quickbooksRealmId = quickbooksConnection?.connection_config.realmId;

  if (!quickbooksRealmId) {
    return new NextResponse(JSON.stringify("QuickBooks not authorized"), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  // Upload the file to QuickBooks
  const response = await createBillInQuickBooks(
    quickbooksRealmId,
    String(quickbooksToken),
  );

  return new NextResponse(JSON.stringify(response), {
    status: StatusCodes.OK,
  });
}

const createBillInQuickBooks = async (realmId: string, token: string) => {
  const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/bill`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      Line: [
        {
          Amount: 100,
          DetailType: "AccountBasedExpenseLineDetail",
          AccountBasedExpenseLineDetail: {
            AccountRef: {
              value: "7",
            },
            BillableStatus: "NotBillable",
            TaxCodeRef: {
              value: "NON",
            },
          },
        },
      ],
      VendorRef: {
        value: "30",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "Failed to create bill in QuickBooks:",
      response.status,
      response.statusText,
      errorText,
    );
    return [];
  }

  const data = await response.json();
  return data;
};
