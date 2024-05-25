import { UUID } from "crypto";

export type InvoiceObject = {
  id: UUID;
  created_at: string;
  data: InvoiceData;
  fileUrl: string;
  status: string;
  flag: string;
};

export interface InvoiceData {
  date: string;
  dueDate: string;
  invoiceNumber: string;
  supplierName: string;
  supplierAddress: string;
  supplierEmail: string;
  supplierPhoneNumber: string;
  customerAddress: string;
  customerName: string;
  shippingAddress: string;
  totalNet: number;
  totalAmount: number;
  totalTax: number;
  lineItems: LineItem[];
  notes: string;
}

export interface LineItem {
  confidence: number;
  description: string;
  productCode: string;
  quantity: number;
  totalAmount: number;
  unitPrice: number;
  pageId: number;
}
