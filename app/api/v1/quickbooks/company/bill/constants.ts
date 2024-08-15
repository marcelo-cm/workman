import { z } from 'zod';

const ReferenceTypeSchema = z.object({
  value: z.string(),
  name: z.string().optional(),
});

const LineDetailSchema = z.object({
  AccountRef: ReferenceTypeSchema,
  TaxAmount: z.number().optional(),
  ClassRef: ReferenceTypeSchema.optional(),
  TaxCodeRef: ReferenceTypeSchema.optional(),
  MarkupInfo: z
    .object({
      PriceLevelRef: ReferenceTypeSchema.optional(),
      Percent: z.number().optional(),
      MarkUpIncomeAccountRef: ReferenceTypeSchema.optional(),
    })
    .optional(),
  BillableStatus: z
    .enum(['Billable', 'NotBillable', 'HasBeenBilled'])
    .optional(),
  CustomerRef: ReferenceTypeSchema.optional(),
});

export const LineItemSchema = z.object({
  /**
   * @readonly Only required for updates
   */
  Id: z.string().optional(),
  DetailType: z.literal('AccountBasedExpenseLineDetail'), // Type of detail for the line item in bills
  /**
   * @value 10.5 format (max 15 digits)
   */
  Amount: z
    .number()
    .refine((val) => /^\d{1,10}(\.\d{1,5})?$/.test(val.toString()), {
      message: 'Amount must be in 10.5 format (max 15 digits)',
    }),
  AccountBasedExpenseLineDetail: LineDetailSchema,
  Description: z.string().max(4000).optional(), // Max 4000 characters
  LineNum: z.number().optional(), // Line number of the line item
});

/**
 * @see https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill
 */
export const BillSchema = z.object({
  /**
   * @readonly Only required for updates
   */
  Id: z.string().optional(),
  VendorRef: ReferenceTypeSchema,
  Line: z.array(LineItemSchema),
  /**
   * @readonly Only required for updates
   */
  SyncToken: z.string().optional(),
  /**
   * Required if Preference.MultiCurrencyEnabled is true.
   * @value 3 letter string ISO 4217 currency code
   * @name Full Name of the Currency
   */
  CurrencyRef: ReferenceTypeSchema.optional(),
  /**
   * YYYY-MM-DD format
   */
  TxnDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  /**
   * Specifies to which AP account the bill is credited.
   * The specified account must have `Account.Classification` set to `Liability` and `Account.AccountSubType` set to `AccountsPayable`
   */
  APAccountRef: ReferenceTypeSchema.optional(),
  SalesTermRef: ReferenceTypeSchema.optional(),
  LinkedTxn: z
    .array(
      z.object({
        TxnId: z.string(),
        TxnType: z.string(),
        /**
         * `TxnId` and `TxnType` are required if this is present
         */
        TxnLineId: z.string(),
      }),
    )
    .optional(),
  /**
   * Method in which tax is applied
   */
  GlobalTaxCalculation: z
    .enum(['TaxExcluded', 'TaxInclusive', 'NotApplicable'])
    .optional(),
  /**
   * Calculated based on the sum of all line items, override if necessary
   */
  TotalAmt: z.number().optional(),
  /**
   * If not provided, it will default to the value specified by `SalesTermRef`
   * YYYY-MM-DD format
   */
  DueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  MetaData: z
    .object({
      CreateTime: z.string(),
      LastUpdatedTime: z.string(),
    })
    .optional(),
  /**
   * Reference number for the transaction. Throws an error when duplicate DocNumber is sent in the request.
   */
  DocNumber: z.string().optional(),
  /**
   * Memo field
   */
  PrivateNote: z.string().optional(),
  TxnTaxDetail: z
    .object({
      TxnTaxCodeRef: ReferenceTypeSchema.optional(),
      TotalTax: z.number().optional(),
      TaxLine: z
        .array(
          z.object({
            DetailType: z.literal('TaxLineDetail'),
            Amount: z.number(),
            TaxLineDetail: z.object({
              TaxRateRef: ReferenceTypeSchema,
              PercentBased: z.boolean().optional(),
              NetAmountTaxable: z.number().optional(),
              TaxInclusiveAmount: z.number().optional(),
              OverrideDeltaAmount: z.number().optional(),
              TaxPercent: z.number().optional(),
            }),
          }),
        )
        .optional(),
    })
    .optional(),
  ExchangeRate: z.number().optional(),
  DepartmentRef: ReferenceTypeSchema.optional(),
  IncludeInAnnualTPAR: z.boolean().optional(),
  /**
   * @readonly Convenience field containing the amount in Balance expressed in terms of the home currency.
   */
  HomeBalance: z.number().optional(),
  /**
   * @readonly
   */
  RecurDataRef: ReferenceTypeSchema.optional(),
  /**
   * @readonly
   */
  Balance: z.number().optional(),
});
