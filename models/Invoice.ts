import { InvoiceData } from "@/interfaces/common.interfaces";
import { mindeeScan } from "@/lib/actions/actions";
import { createMindeeClient } from "@/utils/mindee/client";
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
  flag: string;
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

  static async upload(file: File) {
    console.log("Uploading file: ", file);
    const filePath = `/${file.name}_${new Date().getTime()}`;
    const { data, error } = await supabase.storage
      .from("invoices")
      .upload(filePath, file);

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    console.log("File uploaded to storage: ", data);

    const user = await supabase.auth.getUser();
    const id = user.data.user?.id;

    const {
      data: { publicUrl },
    } = await supabase.storage.from("invoices").getPublicUrl(data.path);

    // we could handle the scan on upload or on demand

    const { error: invoiceError } = await supabase.from("invoices").insert([
      {
        owner: id,
        status: "UNPROCESSED",
        fileUrl: publicUrl,
      },
    ]);

    if (invoiceError) {
      throw new Error(`Failed to create invoice: ${invoiceError.message}`);
    }

    console.log("Invoice created in database");
    return publicUrl;
  }

  static async update(fileUrl: string, data: any) {
    const { data: updatedData, error } = await supabase
      .from("invoices")
      .update({ data, status: "FOR_REVIEW" })
      .eq("fileUrl", fileUrl)
      .select("*");

    if (error) {
      throw new Error(`Failed to update invoice: ${error.message}`);
    }

    console.log("Invoice updated: ", updatedData);

    return updatedData;
  }

  static async scanAndUpdate(fileUrl: string) {
    console.log("Scanning file: ", fileUrl);
    const apiResponse = await mindeeScan(fileUrl);
    const parsedResponse = JSON.parse(apiResponse);
    console.log("Parsed response: ", parsedResponse);
    const parsedData = await Invoice.parse(parsedResponse);
    console.log("Parsed data: ", parsedData);
    const updatedData = await Invoice.update(fileUrl, parsedData);
    console.log("Updated data: ", updatedData);
    return parsedData;
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

  static async parse(parsedApiResponse: any) {
    const prediction = parsedApiResponse.document.inference.prediction;

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
