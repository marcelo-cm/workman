import { UUID } from 'crypto';

export interface Default_Vendor_Category {
  id: number;
  company_id: UUID;
  vendor_id: number;
  vendor_name: string;
  category: string;
  created_at: string;
}
