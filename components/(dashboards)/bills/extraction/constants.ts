import { z } from 'zod';

export const invoiceDataFormSchema = z.object({
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  supplierName: z.string().min(1, 'Supplier name is required'),
  supplierAddress: z.string().min(1, 'Supplier address is required'),
  supplierEmail: z
    .string()
    .min(1, 'Supplier email is required')
    .email('Invalid email'),
  supplierPhoneNumber: z.string().min(1, 'Supplier phone number is required'),
  customerAddress: z.string().min(1, 'Customer address is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  totalNet: z.number().min(0, 'Total net should be a positive number'),
  totalAmount: z.number().min(0, 'Total amount should be a positive number'),
  totalTax: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Number must be positive and decimal'),
  lineItems: z
    .array(
      z.object({
        confidence: z.number().min(0, 'Confidence should be a positive number'),
        description: z.string().min(1, 'Description is required'),
        productCode: z.string().optional(),
        quantity: z.number().min(0, 'Quantity should be a positive number'),
        totalAmount: z
          .string()
          .regex(/^\d+(\.\d+)?$/, 'Number must be positive and decimal'),
        unitPrice: z.number().min(0, 'Unit price should be a positive number'),
        pageId: z.number().min(0, 'Page ID should be a positive number'),
      }),
    )
    .min(1, 'At least one line item is required'),
  notes: z.string(),
});
