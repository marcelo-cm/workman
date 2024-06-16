import { createClient } from '@/utils/supabase/client';
import { UUID } from 'crypto';

const supabase = createClient();

class User {
  id: UUID;
  created_at: string;
  ignore_label_id: string;
  scanned_label_id: string;
  gmail_integration_status: string;
  quickbooks_intergation_status: string;

  constructor({
    id,
    created_at,
    ignore_label_id,
    scanned_label_id,
    gmail_integration_status,
    quickbooks_intergation_status,
  }: User) {
    this.id = id;
    this.created_at = created_at;
    this.ignore_label_id = ignore_label_id;
    this.scanned_label_id = scanned_label_id;
    this.gmail_integration_status = gmail_integration_status;
    this.quickbooks_intergation_status = quickbooks_intergation_status;
  }
}
