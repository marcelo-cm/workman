export const VALID_FILE = {
  id: 'VALID_FILE',
  created_at: 'Wed Aug 14 2024 01:07:58 GMT-0400 (Eastern Daylight Time)',
  file_url:
    'https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/invoices/WorkmanInvoice.pdf_1723612077592',
  status: 'APPROVED',
  data: {
    supplierName: 'Workman Construction Group',
    vendorId: '5',
    invoiceNumber: '18973',
    date: '2024-05-22',
    dueDate: '2024-05-31',
    customerAddress: "Gonza's Gorilla Zoo",
    notes: '',
    lineItems: [
      {
        pageId: 0,
        quantity: 1,
        unitPrice: 1300,
        confidence: 1,
        description: 'Pump Supply For Slab',
        productCode: 'Contract labor',
        totalAmount: '1300.00',
        customerId: '2',
        billable: false,
        accountId: '34',
      },
      {
        pageId: 0,
        quantity: 4704,
        unitPrice: 1.35,
        confidence: 1,
        description:
          'BASEMENT SLAB PER SQ FT (PREPARATION, FORMING, FINISHING)',
        productCode: 'Contract labor',
        totalAmount: '6350.40',
        customerId: '2',
        billable: false,
        accountId: '34',
      },
      {
        pageId: 0,
        quantity: 434,
        unitPrice: 6,
        confidence: 1,
        description: 'FOOTINGS',
        productCode: 'Contract labor',
        totalAmount: '2604.00',
        customerId: '2',
        billable: false,
        accountId: '34',
      },
      {
        pageId: 0,
        quantity: 6400,
        unitPrice: 0.4,
        confidence: 1,
        description: 'TIED REBAR LABOR',
        productCode: 'Contract labor',
        totalAmount: '2560.00',
        customerId: '2',
        billable: false,
        accountId: '34',
      },
      {
        pageId: 0,
        quantity: 592,
        unitPrice: 1,
        confidence: 1,
        description: 'SAW CUTTING PER LINEAL FT',
        productCode: 'Contract labor',
        totalAmount: '592.00',
        customerId: '2',
        billable: false,
        accountId: '34',
      },
      {
        pageId: 0,
        quantity: 1,
        unitPrice: 650,
        confidence: 1,
        description: 'BOB CAT TIME',
        productCode: 'Contract labor',
        totalAmount: '650.00',
        customerId: '2',
        billable: false,
        accountId: '34',
      },
    ],
  },
};

export const INVALID_FILE = {
  id: 'INVALID_FILE',
  created_at: 'Wed Aug 14 2024 01:07:58 GMT-0400 (Eastern Daylight Time)',
  file_url:
    'https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/invoices/WorkmanInvoice.pdf_1723612077592',
  status: 'APPROVED',
  data: {
    supplierName: 'Workman Construction Group',
    vendorId: '5',
    invoiceNumber: '18973',
    date: '2024-05-22',
    dueDate: '2024-05-31',
    customerAddress: "Gonza's Gorilla Zoo",
    notes: '',
    lineItems: [
      {
        pageId: 0,
        quantity: 434,
        unitPrice: 6,
        confidence: 1,
        productCode: 'Contract labor',
        accountId: '34',
      },
      {
        pageId: 0,
        quantity: 6400,
        unitPrice: 0.4,
        confidence: 1,
        description: 'TIED REBAR LABOR',
        productCode: 'Contract labor',
        customerId: '2',
      },
      {
        pageId: 0,
        quantity: 592,
        unitPrice: 1,
        confidence: 1,
        description: 'SAW CUTTING PER LINEAL FT',
        productCode: 'Contract labor',
        totalAmount: '592.00',
        customerId: '2',
        billable: false,
        accountId: '34',
      },
      {
        pageId: 0,
        quantity: 1,
        unitPrice: 650,
        confidence: 1,
        description: 'BOB CAT TIME',
        productCode: 'Contract labor',
        customerId: '2',
        billable: false,
        accountId: '34',
      },
    ],
  },
};

export const API_POST_RESPONSE = {
  DueDate: '2024-05-31',
  Balance: 14056.4,
  domain: 'QBO',
  sparse: false,
  Id: '3',
  SyncToken: '0',
  MetaData: {
    CreateTime: '2024-08-13T19:13:53-07:00',
    LastUpdatedTime: '2024-08-13T19:13:53-07:00',
  },
  DocNumber: '18973',
  TxnDate: '2024-05-22',
  CurrencyRef: {
    value: 'USD',
    name: 'United States Dollar',
  },
  PrivateNote:
    'https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/invoices/WorkmanInvoice.pdf_1723601607161\n\n Filed by Workman',
  Line: [
    {
      Id: '1',
      LineNum: 1,
      Description: 'Pump Supply For Slab',
      Amount: 1300,
      DetailType: 'AccountBasedExpenseLineDetail',
      AccountBasedExpenseLineDetail: {
        CustomerRef: {
          value: '2',
          name: "Gonza's Gorilla Zoo",
        },
        AccountRef: {
          value: '34',
          name: 'Contract labor',
        },
        BillableStatus: 'NotBillable',
        TaxCodeRef: {
          value: 'NON',
        },
      },
    },
    {
      Id: '2',
      LineNum: 2,
      Description: 'BASEMENT SLAB PER SQ FT (PREPARATION, FORMING, FINISHING)',
      Amount: 6350.4,
      DetailType: 'AccountBasedExpenseLineDetail',
      AccountBasedExpenseLineDetail: {
        CustomerRef: {
          value: '2',
          name: "Gonza's Gorilla Zoo",
        },
        AccountRef: {
          value: '34',
          name: 'Contract labor',
        },
        BillableStatus: 'NotBillable',
        TaxCodeRef: {
          value: 'NON',
        },
      },
    },
    {
      Id: '3',
      LineNum: 3,
      Description: 'FOOTINGS',
      Amount: 2604,
      DetailType: 'AccountBasedExpenseLineDetail',
      AccountBasedExpenseLineDetail: {
        CustomerRef: {
          value: '2',
          name: "Gonza's Gorilla Zoo",
        },
        AccountRef: {
          value: '34',
          name: 'Contract labor',
        },
        BillableStatus: 'NotBillable',
        TaxCodeRef: {
          value: 'NON',
        },
      },
    },
    {
      Id: '4',
      LineNum: 4,
      Description: 'TIED REBAR LABOR',
      Amount: 2560,
      DetailType: 'AccountBasedExpenseLineDetail',
      AccountBasedExpenseLineDetail: {
        CustomerRef: {
          value: '2',
          name: "Gonza's Gorilla Zoo",
        },
        AccountRef: {
          value: '34',
          name: 'Contract labor',
        },
        BillableStatus: 'NotBillable',
        TaxCodeRef: {
          value: 'NON',
        },
      },
    },
    {
      Id: '5',
      LineNum: 5,
      Description: 'SAW CUTTING PER LINEAL FT',
      Amount: 592,
      DetailType: 'AccountBasedExpenseLineDetail',
      AccountBasedExpenseLineDetail: {
        CustomerRef: {
          value: '2',
          name: "Gonza's Gorilla Zoo",
        },
        AccountRef: {
          value: '34',
          name: 'Contract labor',
        },
        BillableStatus: 'NotBillable',
        TaxCodeRef: {
          value: 'NON',
        },
      },
    },
    {
      Id: '6',
      LineNum: 6,
      Description: 'BOB CAT TIME',
      Amount: 650,
      DetailType: 'AccountBasedExpenseLineDetail',
      AccountBasedExpenseLineDetail: {
        CustomerRef: {
          value: '2',
          name: "Gonza's Gorilla Zoo",
        },
        AccountRef: {
          value: '34',
          name: 'Contract labor',
        },
        BillableStatus: 'NotBillable',
        TaxCodeRef: {
          value: 'NON',
        },
      },
    },
  ],
  VendorRef: {
    value: '5',
    name: 'Workman Construction Group',
  },
  APAccountRef: {
    value: '18',
    name: 'Accounts Payable (A/P)',
  },
  TotalAmt: 14056.4,
};
