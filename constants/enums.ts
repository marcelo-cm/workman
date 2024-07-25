export enum InvoiceState {
  UNPROCESSED = 'UNPROCESSED',
  FOR_REVIEW = 'FOR_REVIEW',
  PROCESSED = 'PROCESSED',
}

export enum Roles {
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  BOOKKEEPER = 'BOOKKEEPER',
}

export enum Approvable {
  INVOICE = 'INVOICE',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
