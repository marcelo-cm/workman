import { UUID } from 'crypto';

import { Roles } from '@/constants/enums';

import { InvoiceData } from './common.interfaces';

export interface Default_Vendor_Category {
  id: number;
  company_id: UUID;
  vendor_id: number;
  vendor_name: string;
  category: string;
  created_at: string;
}

export interface User_Update {
  scanned_label_id?: string;
  ignore_label_id?: string;
  gmail_integration_status?: boolean;
  quickbooks_integration_status?: boolean;
  email?: string;
  company_id?: UUID;
  roles?: Roles[];
  name?: string;
}

export interface Invoice {
  id: UUID;
  created_at: string;
  data: InvoiceData;
  file_url: string;
  status: string;
}

export interface InvoiceCounts {
  company_inbox: number;
  awaiting_review: number;
}

export enum InvoiceCountResponseKeys {
  COMPANY_INBOX = 'company_inbox',
  AWAITING_REVIEW = 'awaiting_review',
}

export type InvoiceCountsResponse = {
  [InvoiceCountResponseKeys.COMPANY_INBOX]: InvoiceCounts['company_inbox'];
  [InvoiceCountResponseKeys.AWAITING_REVIEW]: InvoiceCounts['awaiting_review'];
};
