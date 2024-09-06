import { LineItem } from './common.interfaces';
import { Invoice } from './db.interfaces';

export interface Vendor {
  BillAddr?: Address;
  Balance?: number;
  AcctNum?: string;
  Vendor1099?: boolean;
  CurrencyRef?: CurrencyReference;
  domain?: string;
  sparse?: boolean;
  Id: string;
  SyncToken?: string;
  MetaData?: MetaData;
  GivenName?: string;
  FamilyName?: string;
  CompanyName: string;
  DisplayName: string;
  PrintOnCheckName?: string;
  Active?: boolean;
  PrimaryPhone?: {
    FreeFormNumber: string;
  };
  PrimaryEmailAddr?: {
    Address: string;
  };
  WebAddr?: {
    URI: string;
  };
}

export interface Customer {
  Taxable: boolean;
  BillAddr: Address;
  Job: boolean;
  BillWithParent: boolean;
  Balance: number;
  BalanceWithJobs: number;
  CurrencyRef: CurrencyRef;
  PreferredDeliveryMethod: string;
  domain: string;
  sparse: boolean;
  Id: string;
  SyncToken: string;
  MetaData: MetaData;
  GivenName: string;
  FamilyName: string;
  FullyQualifiedName: string;
  CompanyName: string;
  DisplayName: string;
  PrintOnCheckName: string;
  Active: boolean;
  PrimaryPhone: Phone;
  PrimaryEmailAddr: Email;
}

export interface Account {
  Name: string;
  SubAccount: boolean;
  FullyQualifiedName: string;
  Active: boolean;
  Classification: string;
  AccountType: string;
  AccountSubType: string;
  CurrentBalance: number;
  CurrentBalanceWithSubAccounts: number;
  CurrencyRef: CurrencyRef;
  domain: string;
  sparse: boolean;
  Id: string;
  SyncToken: string;
  MetaData: MetaData;
}

export interface Invoice_Quickbooks extends Omit<Invoice, 'data'> {
  data: {
    supplierName: string;
    vendorId: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    customerAddress: string;
    notes: string;
    lineItems: LineItem_QuickBooks[];
  };
}

export interface LineItem_QuickBooks extends LineItem {
  customerId: string;
  billable: boolean;
  accountId: string;
}

interface Address {
  Id: string;
  Line1: string;
  City: string;
  CountrySubDivisionCode: string;
  PostalCode: string;
  Lat: string;
  Long: string;
}

interface CurrencyReference {
  value: string;
  name: string;
}

interface MetaData {
  CreateTime: string;
  LastUpdatedTime: string;
}

interface CurrencyRef extends CurrencyReference {}

interface Phone {
  FreeFormNumber: string;
}

interface Email {
  Address: string;
}
