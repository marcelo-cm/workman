import { NextRequest, NextResponse } from "next/server";
import { Nango, Connection } from "@nangohq/node";
import { StatusCodes } from "http-status-codes";
import { InvoiceObject } from "@/models/Invoice";

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

  const { userId, file }: { userId: string; file: InvoiceObject } = body;

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
    file,
  );

  return new NextResponse(JSON.stringify(response), {
    status: StatusCodes.OK,
  });
}

const createBillInQuickBooks = async (
  realmId: string,
  token: string,
  file: InvoiceObject,
) => {
  const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/bill`;

  const lineItems = file.data.lineItems.map((item) => ({
    DetailType: "AccountBasedExpenseLineDetail",
    Amount: item.totalAmount,
    AccountBasedExpenseLineDetail: {
      AccountRef: {
        value: "7", // Assuming "7" is the expense account ID; replace with actual account ID
      },
      BillableStatus: "NotBillable",
      TaxCodeRef: {
        value: "NON", // Assuming "NON" is the tax code; replace with actual tax code if needed
      },
    },
    Description: item.description, // Optional: Description for the line item
  }));

  const vendorRef = {
    value: "58",
    name: "Workman Construction Group", // Optional: Adding name for better clarity
  };

  const bill = {
    Line: lineItems,
    VendorRef: vendorRef,
    DueDate: file.data.dueDate, // Optional: Adding due date if available
    CurrencyRef: {
      value: "USD", // Assuming the currency is USD; replace if needed
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(bill),
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
