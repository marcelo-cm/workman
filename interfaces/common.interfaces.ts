export interface InvoiceData {
  date: string;
  dueDate: string;
  invoiceNumber: string;
  supplierName: string;
  supplierAddress: string;
  supplierEmail: string;
  supplierPhoneNumber: string;
  totalNet: number;
  totalAmount: number;
  totalTax: number;
  lineItems: LineItem[];
  notes: string;
}

interface LineItem {
  confidence: number;
  description: string;
  productCode: string;
  quantity: number;
  totalAmount: number;
  unitPrice: number;
  pageId: number;
}
