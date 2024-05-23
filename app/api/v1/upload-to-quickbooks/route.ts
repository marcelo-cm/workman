import { NextRequest, NextResponse } from "next/server";
import { Nango, Connection } from "@nangohq/node";
import { StatusCodes } from "http-status-codes";
import { InvoiceObject } from "@/models/Invoice";

const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

interface QuickBooksAPIRequest {
  VendorRef?: {
    // Reference to the vendor (must query vendor list for this)
    value: string; // ID of the vendor
    name?: string; // Identifying Display Name for object being referenced by value.
  };
  Line: LineItem[];
  CurrencyRef?: {
    // Only if Preference.MultiCurrencyEnabled is true
    value: string; // 3 letter string ISO 4217 currency code
    name?: string; // Full Name of the Currency
  };
}

interface LineItem {
  Id?: string; // Required only for updates, or if you specify an ID that doesn't exist then it'll create a line
  DetailType: "AccountBasedExpenseLineDetail"; // Type of detail for the line item in bills
  Amount: number; // Max 15 digits in 10.5 format
  AccountBasedExpenseLineDetail: {
    AccountRef: {
      // Reference to the Expense account associated with this item (must query account name list for this)
      value: string; // ID of the account, on mismatch it'll use an account that matches transaction location and VAT used if applicable
      name?: string; // Identifying Display Name for object being referenced by value.
    };
    TaxAmount?: number; // Sales tax paid as a part of the expense
    TaxInclusiveAmt?: number; // AVAILABLE IN minorversion=1 ONLY. Total amount of the line item including tax
    ClassRef?: {
      // Reference to the class, only available if Preferences.AccountingInfoPrefs.ClassTrackingPerLine is true (must query class list for this)
      value: string; // ID of the class
      name?: string; // Identifying Display Name for object being referenced by value.
    };
    TaxCodeRef?: {
      // Tax code (must query TaxCode list for this)
      value: string; // ID of the tax code
      name?: string; // Identifying Display Name for object being referenced by value.
    };
    MarkupInfo?: {
      // Markup info for the line
      PriceLevelRef?: {
        value: string; // ID of the price level
        name?: string;
      };
      Percent?: number; // Markup amount expressed as a percent of charges already entered in the current transaction. To enter a rate of 10% use 10.0, not 0.01.
      MarkUpIncomeAccountRef?: {
        // Only available with invoice objects when linktxn specified a ReimburseCharge
        value: string;
        name?: string;
      };
    };
    BillableStatus?: "Billable" | "NotBillable" | "HasBeenBilled"; // Whether the line item is billable or not
    CustomerRef?: {
      // Reference to the customer (must query customer list for this)
      value: string; // ID of the customer
      name?: string; // Identifying Display Name for object being referenced by value.
    };
  };
  Description?: string; // Max 4000 characters
  LineNum?: number; // Line number of the line item
}

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

  const lineItems: LineItem[] = file.data.lineItems.map((item) => ({
    DetailType: "AccountBasedExpenseLineDetail",
    Amount: item.totalAmount,
    AccountBasedExpenseLineDetail: {
      AccountRef: {
        value: "63", // 63 is hardcoded for, Job Expenses:Job Materials
      },
      BillableStatus: "Billable",
      CustomerRef: {
        value: "59", // 59 is hardcoded for now as a customer ID, Marlin Hill as per demo data
      },
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
    PrivateNote: file.data.notes + "\n" + file.fileUrl + "\n Filed by Workman",
    // SalesTermRef: {
    //   value: "2", // 2 is hardcoded for now as Net 15
    // },
    DocNumber: file.data.invoiceNumber, // Optional: Adding invoice number if available
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
