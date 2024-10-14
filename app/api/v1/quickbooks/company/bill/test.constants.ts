export const VALID_FILE = {
  _id: '88c2d588-3c5a-437e-bd14-a40775df1db6',
  _created_at: '2024-10-12T10:59:56.269Z',
  data: {
    date: '2024-03-16',
    dueDate: '2024-03-31',
    invoiceNumber: '3726',
    supplierName: 'Roma Concrete',
    supplierAddress: '349 CLAUDE SCOTT RD CANTON, GA 30115',
    supplierEmail: 'orlandocruz99@yahoo.com',
    supplierPhoneNumber: '7706088191',
    customerAddress: '21 Baker Company Overhead and Margin',
    customerName: 'PRECISION HOMES',
    shippingAddress: '121 SHARP MOUNTAIN CREEK RD BALL GROUND GA 30107',
    totalNet: 12043.75,
    totalAmount: 12043.75,
    totalTax: '0',
    lineItems: [
      {
        pageId: 0,
        billable: true,
        quantity: 2.952,
        unitPrice: 1.25,
        confidence: 1,
        description:
          'UPPER DRIVEWAY LABOR PER SQUARE FT (PREPARATION, FORMING, FINISHING, SAW CUTTING, FOOTINGS, & TIED REBAR)',
        productCode: { Name: 'Advertising & Marketing', sparse: true, Id: '4' },
        totalAmount: '3690.00',
      },
      {
        pageId: 0,
        billable: true,
        quantity: 3.883,
        unitPrice: 1.25,
        confidence: 1,
        description:
          'LOWER DRIVEWAY LABOR PER SQUARE FT (PREPARATION, FORMING, FINISHING, SAW CUTTING, FOOTINGS, & TIED REBAR)',
        productCode: { Name: 'Carpet', sparse: true, Id: '46' },
        totalAmount: '4853.75',
      },
      {
        pageId: 0,
        billable: true,
        quantity: 6,
        unitPrice: 0.4,
        confidence: 1,
        description: 'LOWER DRIVEWAY EXTRA TIED REBAR & DRILL HOLES',
        productCode: { Name: 'Appliances', sparse: true, Id: '43' },
        totalAmount: '2400.00',
      },
      {
        pageId: 0,
        billable: true,
        quantity: 1,
        unitPrice: 250,
        confidence: 1,
        description: 'LOWER DRIVEWAY 4 PEER PADS FOOTING',
        productCode: { Name: 'Cabinets & Hardware', sparse: true, Id: '45' },
        totalAmount: '250.00',
      },
      {
        pageId: 0,
        billable: true,
        quantity: 1,
        unitPrice: 850,
        confidence: 1,
        description: 'BOB CAT TIME',
        productCode: { Name: 'Appliances', sparse: true, Id: '43' },
        totalAmount: '850.00',
      },
    ],
    notes: '',
  },
  _status: 'APPROVED',
  _file_url:
    'https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/invoices/Invoice_3726_from_ROMA_CONCRETE.pdf_1728730788583',
  _principal: {
    _id: '3fed9c01-ce90-45f8-8048-e123c74de69b',
    _name: 'Tad Ellsworth',
    _email: 'tad@pchb.us',
  },
  _company: {
    _id: 'f28d181c-0154-4aa7-88f8-8c9aa765e8ab',
    _name: 'Precision Custom Home Builders Inc.',
    _created_at: '2024-09-18T17:37:34.782Z',
  },
  customerAddress: {
    sparse: true,
    Id: '1072',
    DisplayName: '21 Baker Company Overhead and Margin',
  },
  supplierName: { sparse: true, Id: '164', DisplayName: 'Roma Concrete' },
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
