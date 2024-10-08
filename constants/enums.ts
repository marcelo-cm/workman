export enum InvoiceStatus {
  UNPROCESSED = 'UNPROCESSED',
  FOR_REVIEW = 'FOR_REVIEW',
  APPROVED = 'APPROVED',
  PROCESSED = 'PROCESSED',
}

export enum ReceiptStatus {
  UNPROCESSED = 'UNPROCESSED',
  FOR_REVIEW = 'FOR_REVIEW',
  APPROVED = 'APPROVED',
  PROCESSED = 'PROCESSED',
}

export enum Roles {
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  BOOKKEEPER = 'BOOKKEEPER',
}

export enum Approvable {
  INVOICE = 'Invoice',
  RECEIPT = 'Receipt',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
