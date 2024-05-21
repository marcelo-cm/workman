import { NextRequest, NextResponse } from "next/server";
import { Nango, Connection } from "@nangohq/node";
import { createClient } from "@/utils/supabase/server";
import { StatusCodes } from "http-status-codes";

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return new NextResponse(JSON.stringify("User ID is required"), {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const quickbooksToken = await nango.getToken("quickbooks", userId);
    const quickbooksConnection: Connection = await nango.getConnection(
      "quickbooks",
      userId,
    );

    const quickbooksRealmId = quickbooksConnection?.connection_config.realmId;

    console.log("QuickBooks Realm ID:", quickbooksRealmId);
    console.log("QuickBooks Token:", quickbooksToken);

    if (!quickbooksRealmId) {
      return new NextResponse(JSON.stringify("QuickBooks not authorized"), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const vendorList = await getVendorList(
      quickbooksRealmId,
      String(quickbooksToken),
    );

    return new NextResponse(JSON.stringify(vendorList), {
      status: StatusCodes.OK,
    });
  } catch (e: unknown) {
    console.error(e);
    return new NextResponse(JSON.stringify("Internal Server Error"), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

const getVendorList = async (realmId: string, token: string) => {
  const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/9341452341740458/query?query=select * from vendor`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  console.log("Response:", response);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "Failed to fetch vendor list:",
      response.status,
      response.statusText,
      errorText,
    );
    return [];
  }

  const data = await response.json();
  console.log("Vendor List:", data);

  return data;
};
