export interface Invoice {
  file_name: string;
  file?: File;
  sender: string;
  status: string;
  data: {
    invoice_number: string;
    date_invoiced: string;
    date_due: string;
    date_uploaded: string;
    balance: number;
    vendor_name: string;
    project_code: string;
    line_items: {
      name: string;
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
    }[];
  };
}
