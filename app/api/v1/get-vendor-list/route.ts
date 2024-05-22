import { NextRequest, NextResponse } from "next/server";
import { Nango, Connection } from "@nangohq/node";
import { StatusCodes } from "http-status-codes";

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const select = req.nextUrl.searchParams.get("select");

    if (!userId || !select) {
      return new NextResponse(
        JSON.stringify("User ID and Select are both required"),
        {
          status: StatusCodes.BAD_REQUEST,
        },
      );
    }

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

    const vendorList = await getVendorList(
      quickbooksRealmId,
      String(quickbooksToken),
      select,
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

const getVendorList = async (
  realmId: string,
  token: string,
  columns: string,
) => {
  const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query?query=select ${columns} from vendor`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

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

  return data;
};
