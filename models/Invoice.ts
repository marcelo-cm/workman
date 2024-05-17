import { InvoiceData } from "@/interfaces/common.interfaces";
import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";
import * as mindee from "mindee";

const supabase = createClient();

export type InvoiceObject = {
  id: UUID;
  created_at: string;
  data: InvoiceData;
  fileUrl: string;
  status: string;
  flag: string | null;
};

class Invoice {
  id: UUID;
  created_at: string;
  data: InvoiceData;
  fileUrl: string;
  status: string;
  flag: string;

  constructor({ id, created_at, data, status, fileUrl, flag }: InvoiceObject) {
    this.id = id;
    this.created_at = created_at;
    this.data = data;
    this.status = status;
    this.fileUrl = fileUrl;
    this.flag = flag;
  }

  static async create(data: any, fileUrl: string) {
    const user = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: insertedData, error } = await supabase
      .from("invoices")
      .insert({
        data,
        fileUrl,
        status: "FOR_REVIEW",
        owner: user.data.user?.id,
      });

    if (error) {
      throw new Error(`Failed to create invoice: ${error.message}`);
    }

    return insertedData;
  }

  static async update(fileUrl: string, data: any) {
    const { data: updatedData, error } = await supabase
      .from("invoices")
      .update({ data })
      .eq("fileUrl", fileUrl)
      .select("*");

    if (error) {
      throw new Error(`Failed to update invoice: ${error.message}`);
    }

    return updatedData;
  }

  static async getByUrl(url: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("fileUrl", url);

    if (error) {
      throw new Error(`Failed to get invoice: ${error.message}`);
    }

    return data[0];
  }

  static async parse(apiResponse: any) {
    const prediction = apiResponse.document.inference.prediction;

    const mappedData = {
      date: prediction.date?.value || "",
      dueDate: prediction.dueDate?.value || "",
      invoiceNumber: prediction.invoiceNumber?.value || "",
      supplierName: prediction.supplierName?.value || "",
      supplierAddress: prediction.supplierAddress?.value || "",
      supplierEmail: prediction.supplierEmail?.value || "",
      supplierPhoneNumber: prediction.supplierPhoneNumber?.value || "",
      totalNet: prediction.totalNet?.value || 0,
      totalAmount: prediction.totalAmount?.value || 0,
      totalTax: prediction.totalTax?.value || 0,
      lineItems:
        prediction.lineItems?.map(
          (item: {
            confidence: number;
            description: string;
            productCode: string;
            quantity: number;
            totalAmount: number;
            unitPrice: number;
            pageId: number;
          }) => ({
            confidence: item.confidence || 0,
            description: item.description || "",
            productCode: item.productCode || "",
            quantity: item.quantity || 0,
            totalAmount: item.totalAmount || 0,
            unitPrice: item.unitPrice || 0,
            pageId: item.pageId || 0,
          }),
        ) || [],
      notes: "",
    };

    return mappedData;
  }
}

export default Invoice;
