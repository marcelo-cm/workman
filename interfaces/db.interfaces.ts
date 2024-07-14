import { UUID } from 'crypto';

export interface Default_Vendor_Category {
  id: number;
  company_id: UUID;
  vendor_id: number;
  category: string;
  created_at: string;
}
