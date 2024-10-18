import { z } from 'zod';

import { InvoiceData, InvoiceLineItem } from '@/interfaces/common.interfaces';
import { Account, Customer, Vendor } from '@/interfaces/quickbooks.interfaces';
import Invoice from '@/models/Invoice';

import { BillSchema, LineItemSchema } from './constants';

export type Bill = z.infer<typeof BillSchema>;
export type LineItem = z.infer<typeof LineItemSchema>;

interface LineItemWithMatchedAccount
  extends Omit<InvoiceLineItem, 'productCode'> {
  productCode: Account;
}

interface InvoiceDataWithMatchedValues extends Omit<InvoiceData, 'lineItems'> {
  lineItems: LineItemWithMatchedAccount[];
}

/**
 * Invoice with matched values,
 */
export interface InvoiceWithMatchedValues
  extends Omit<Invoice, 'data' | 'supplierName' | 'customerAddress'> {
  data: InvoiceDataWithMatchedValues;
  _file_url: string;
  supplierName: Vendor;
  customerAddress: Customer;
}
