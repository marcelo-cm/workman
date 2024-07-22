import { UUID } from 'crypto';

import { Roles } from '@/constants/enums';
import { createClient } from '@/utils/supabase/client';

import { Company } from './Company';

const supabase = createClient();

export class User {
  private _id: UUID;
  private _email: string;
  private _company: Company;
  private _ignore_label_id: string;
  private _scanned_label_id: string;
  private _gmail_integration_status: string;
  private _quickbooks_integration_status: string;
  private _roles: string[];
  private _created_at: Date;

  constructor({
    id,
    email,
    company,
    ignore_label_id,
    scanned_label_id,
    gmail_integration_status,
    quickbooks_integration_status,
    roles,
    created_at,
  }: {
    id: UUID;
    email: string;
    company: Company;
    ignore_label_id: string;
    scanned_label_id: string;
    gmail_integration_status: string;
    quickbooks_integration_status: string;
    roles: Roles[];
    created_at: string;
  }) {
    this._id = id;
    this._email = email;
    this._company = company;
    this._ignore_label_id = ignore_label_id;
    this._scanned_label_id = scanned_label_id;
    this._gmail_integration_status = gmail_integration_status;
    this._quickbooks_integration_status = quickbooks_integration_status;
    this._roles = roles;
    this._created_at = new Date(created_at);
  }

  get id(): UUID {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get company(): Company {
    return this._company;
  }

  get ignoreLabelId(): string {
    return this._ignore_label_id;
  }

  get scannedLabelId(): string {
    return this._scanned_label_id;
  }

  get gmailIntegrationStatus(): string {
    return this._gmail_integration_status;
  }

  get quickbooksIntegrationStatus(): string {
    return this._quickbooks_integration_status;
  }

  get roles(): string[] {
    return this._roles;
  }

  get createdAt(): Date {
    return this._created_at;
  }
}
