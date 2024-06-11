import { UUID } from 'crypto';

export interface UserConfig {
  id: UUID;
  created_at: string;
  scanned_label_id: string;
  ignore_label_id: string;
}

/**
 * Represents an invoice object retrieved from the database in Supabase.
 */
export type InvoiceObject = {
  id: UUID;
  created_at: string;
  data: InvoiceData;
  fileUrl: string;
  status: string;
  flag: string;
};

/**
 * This is the data we save from the API call to the OCR service. It's achieved by parsing the JSON response using Invoice.parse.
 */
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

/**
 * Represents a line item in an invoice as it's saved in the database.
 */
export interface LineItem {
  confidence: number;
  description: string;
  productCode?: string;
  quantity: number;
  totalAmount: string;
  unitPrice: number;
  pageId: number;
}
