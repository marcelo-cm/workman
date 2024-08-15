import { z } from 'zod';

const ReferenceTypeSchema = z.object({
  value: z.string(),
  name: z.string().optional(),
});

export const LineItemSchema = z.object({
  /**
   * @readonly Only required for updates
   */
  Id: z.string().optional(),
  DetailType: z.literal('AccountBasedExpenseLineDetail'), // Type of detail for the line item in bills
  Amount: z
    .number()
    .refine((val) => /^\d{1,10}(\.\d{1,5})?$/.test(val.toString()), {
      message: 'Amount must be in 10.5 format (max 15 digits)',
    }), // Max 15 digits in 10.5 format
  AccountBasedExpenseLineDetail: z.object({
    AccountRef: z.object({
      value: z.string(), // ID of the account, on mismatch it'll use an account that matches transaction location and VAT used if applicable
      name: z.string().optional(), // Identifying Display Name for object being referenced by value
    }),
    TaxAmount: z.number().optional(), // Sales tax paid as a part of the expense
    TaxInclusiveAmt: z.number().optional(), // Total amount of the line item including tax
    ClassRef: z
      .object({
        value: z.string(), // ID of the class
        name: z.string().optional(), // Identifying Display Name for object being referenced by value
      })
      .optional(), // Available if ClassTrackingPerLine is true
    TaxCodeRef: z
      .object({
        value: z.string(), // ID of the tax code
        name: z.string().optional(), // Identifying Display Name for object being referenced by value
      })
      .optional(), // Tax code (must query TaxCode list for this)
    MarkupInfo: z
      .object({
        PriceLevelRef: z
          .object({
            value: z.string(), // ID of the price level
            name: z.string().optional(),
          })
          .optional(),
        Percent: z.number().optional(), // Markup amount as a percent of charges
        MarkUpIncomeAccountRef: z
          .object({
            value: z.string(), // Only available with invoice objects when linktxn specified a ReimburseCharge
            name: z.string().optional(),
          })
          .optional(),
      })
      .optional(), // Markup info for the line
    BillableStatus: z
      .enum(['Billable', 'NotBillable', 'HasBeenBilled'])
      .optional(), // Whether the line item is billable or not
    CustomerRef: z
      .object({
        value: z.string(), // ID of the customer
        name: z.string().optional(), // Identifying Display Name for object being referenced by value
      })
      .optional(), // Reference to the customer
  }),
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
