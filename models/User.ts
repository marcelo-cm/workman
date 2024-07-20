import { UUID } from 'crypto';

import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export class User {
  id: UUID;
  email: string;
  company_id: UUID;
  ignore_label_id: string;
  scanned_label_id: string;
  gmail_integration_status: string;
  quickbooks_integration_status: string;
  created_at: string;

  constructor({
    id,
    email,
    company_id,
    ignore_label_id,
    scanned_label_id,
    gmail_integration_status,
    quickbooks_integration_status,
    created_at,
  }: User) {
    this.id = id;
    this.email = email;
    this.company_id = company_id;
    this.ignore_label_id = ignore_label_id;
    this.scanned_label_id = scanned_label_id;
    this.gmail_integration_status = gmail_integration_status;
    this.quickbooks_integration_status = quickbooks_integration_status;
    this.created_at = created_at;
  }
}
