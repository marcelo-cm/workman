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
  DisplayName?: string;
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

interface CurrencyRef {
  value: string;
  name: string;
}

interface MetaData {
  CreateTime: string;
  LastUpdatedTime: string;
}

interface Phone {
  FreeFormNumber: string;
}

interface Email {
  Address: string;
}
