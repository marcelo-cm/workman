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
  totalTax: string;
  lineItems: InvoiceLineItem[];
  notes: string;
}

/**
 * Represents a line item in an invoice as it's saved in the database.
 */
export interface InvoiceLineItem {
  confidence: number;
  description: string;
  productCode?: string;
  quantity: number;
  totalAmount: string;
  unitPrice: number;
  pageId: number;
  // polygon: Polygon;
}

export interface ReceiptData {
  category: string;
  date: string;
  lineItems: ReceiptLineItem[];
  subcategory: string;
  supplierName: string;
  time: string;
  tip: number;
  totalAmount: number;
  totalNet: number;
  totalTax: string;
}

export interface ReceiptLineItem {
  confidence: number;
  description: string;
  totalAmount: string;
}
