import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

export const ReceiptDataSchema = z.object({
  category: z.string(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  supplierName: z.string(),
  totalNet: z.string(),
  description: z.string(),
  customerName: z.string().default('Unassigned'),
});

export type ReceiptData = z.infer<typeof ReceiptDataSchema>;
