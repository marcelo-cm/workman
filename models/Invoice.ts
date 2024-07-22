import { decode } from 'base64-arraybuffer';
import { UUID } from 'crypto';

import { toast } from '@/components/ui/use-toast';

import { PDFData } from '@/app/api/v1/gmail/messages/route';
import { InvoiceData } from '@/interfaces/common.interfaces';
import {
  Invoice_Quickbooks,
  LineItem_QuickBooks,
} from '@/interfaces/quickbooks.interfaces';
import { mindeeScan } from '@/lib/actions/actions';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export class Invoice {
  private _id: UUID;
  private _created_at: string;
  private _data: InvoiceData;
  private _file_url: string;
  private _status: string;

  constructor({
    id,
    created_at,
    data,
    status,
    file_url,
  }: {
    id: UUID;
    created_at: string;
    data: InvoiceData;
    status: string;
    file_url: string;
  }) {
    this._id = id;
    this._created_at = created_at;
    this._data = data;
    this._status = status;
    this._file_url = file_url;
  }

  static async upload(file: File | PDFData) {
    let data, error;
    if (file instanceof File) {
      const filePath = `/${file.name}_${new Date().getTime()}`;
      ({ data, error } = await supabase.storage
        .from('invoices')
        .upload(filePath, file));

      if (error) {
        toast({
          title: `Failed to upload file ${file.name}`,
          description: 'Please try to upload this document again',
          variant: 'destructive',
        });
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      toast({
        title: `${file.name} uploaded to storage successfully`,
        variant: 'success',
      });
    } else {
      const filePath = `/${file.filename}_${new Date().getTime()}`;
      ({ data, error } = await supabase.storage
        .from('invoices')
        .upload(filePath, decode(file.base64), {
          contentType: 'application/pdf',
        }));

      if (error) {
        toast({
          title: `Failed to upload file ${file.filename}`,
          description: 'Please try to upload this document again',
          variant: 'destructive',
        });
        throw new Error(`Failed to upload file: ${error.message}`);
      }
    }

    if (!data) {
      toast({
        title: `Failed to upload file`,
        description: 'Please try to upload this document again',
        variant: 'destructive',
      });
      throw new Error(`Failed to upload file`);
    }

    const user = await supabase.auth.getUser();
    const id = user.data.user?.id;

    const {
      data: { publicUrl },
    } = await supabase.storage.from('invoices').getPublicUrl(data.path);

    const { error: invoiceError } = await supabase.from('invoices').insert([
      {
        owner: id,
        status: 'UNPROCESSED',
        fileUrl: publicUrl,
      },
    ]);

    if (invoiceError) {
      toast({
        title: `Failed to upload invoice ${file instanceof File ? file.name : file.filename} to database`,
        description: 'Please try to upload this document again',
        variant: 'destructive',
      });
      throw new Error(`Failed to create invoice: ${invoiceError.message}`);
    }

    toast({
      title: `${file instanceof File ? file.name : file.filename} uploaded to database`,
    });

    return publicUrl;
  }

  static async uploadToQuickbooks(file: Invoice_Quickbooks) {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error('User not found');
    }

    const userId = data.user.id;

    const body = {
      file: file,
      userId: userId,
    };

    const response = await fetch(`/api/v1/quickbooks/company/bill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    toast({
      title: 'Invoice uploaded to QuickBooks',
      description: responseData.message,
      variant: 'success',
    });

    const { data: updatedData, error: updateError } = await supabase
      .from('invoices')
      .update({ status: 'PROCESSED' })
      .eq('id', file.id)
      .select('*');

    if (updateError) {
      toast({
        title: `Failed to update invoice status`,
        description: 'Please try again later',
        variant: 'destructive',
      });
      throw new Error(`Failed to update invoice: ${updateError.message}`);
    }

    toast({
      title: `Invoice status updated to PROCESSED`,
    });
  }

  static async update(fileUrl: string, data: any) {
    const { data: updatedData, error } = await supabase
      .from('invoices')
      .update({ data, status: 'FOR_REVIEW' })
      .eq('file_url', fileUrl) // why fileUrl and not id?
      .select('*');

    if (error) {
      toast({
        title: `Failed to updating or scanning ${decodeURI(fileUrl.split('/')[8].split('.pdf')[0])}`,
        description: 'Please scan this document again unprocessed',
        variant: 'destructive',
      });
      throw new Error(`Failed to update invoice: ${error.message}`);
    }

    toast({
      title: `Invoice ${fileUrl.split('/')[8].split('.pdf')[0]} has been updated`,
      variant: 'success',
    });

    return updatedData;
  }

  static async scanAndUpdate(fileUrl: string) {
    const apiResponse = await mindeeScan(fileUrl);
    const parsedResponse = JSON.parse(apiResponse);
    const parsedData = await Invoice.parse(parsedResponse);
    const updatedData = await Invoice.update(fileUrl, parsedData);
    return parsedData;
  }

  static async getByUrl(url: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('fileUrl', url);

    if (error) {
      toast({
        title: `Failed to fetch invoice`,
        description: 'Please try again later',
        variant: 'destructive',
      });
      throw new Error(`Failed to get invoice: ${error.message}`);
    }

    return data[0];
  }

  static async parse(parsedApiResponse: any) {
    const prediction = parsedApiResponse.document.inference.prediction;

    const mappedData = {
      date: prediction.date?.value || '',
      dueDate: prediction.dueDate?.value || '',
      invoiceNumber: prediction.invoiceNumber?.value || '',
      supplierName: prediction.supplierName?.value || '',
      supplierAddress: prediction.supplierAddress?.value || '',
      supplierEmail: prediction.supplierEmail?.value || '',
      supplierPhoneNumber: prediction.supplierPhoneNumber?.value || '',
      customerAddress: prediction.customerAddress?.value || '',
      customerName: prediction.customerName?.value || '',
      shippingAddress: prediction.shippingAddress?.value || '',
      totalNet: prediction.totalNet?.value || 0,
      totalAmount: prediction.totalAmount?.value || 0,
      totalTax: prediction.totalTax?.value || 0,
      lineItems:
        prediction.lineItems?.map(
          (item: {
            confidence: number;
            description: string;
            productCode: string;
            quantity: number;
            totalAmount: number;
            unitPrice: number;
            pageId: number;
          }) => ({
            confidence: item.confidence || 0,
            description: item.description || '',
            productCode: item.productCode || '',
            quantity: item.quantity || 0,
            totalAmount: item.totalAmount.toFixed(2) || 0,
            unitPrice: item.unitPrice || 0,
            pageId: item.pageId || 0,
          }),
        ) || [],
      notes: '',
    };

    return mappedData;
  }

  get id(): UUID {
    return this._id;
  }

  get createdAt(): string {
    return this._created_at;
  }

  get data(): InvoiceData {
    return this._data;
  }

  get fileUrl(): string {
    return this._file_url;
  }

  get status(): string {
    return this._status;
  }

  get totalAmount(): number {
    return this._data.totalAmount;
  }

  get totalNet(): number {
    return this._data.totalNet;
  }

  get totalTax(): string {
    return this._data.totalTax;
  }

  get date(): string {
    return this._data.date;
  }

  get dueDate(): string {
    return this._data.dueDate;
  }

  get invoiceNumber(): string {
    return this._data.invoiceNumber;
  }

  get supplierName(): string {
    return this._data.supplierName;
  }

  get supplierAddress(): string {
    return this._data.supplierAddress;
  }

  get supplierEmail(): string {
    return this._data.supplierEmail;
  }

  get supplierPhoneNumber(): string {
    return this._data.supplierPhoneNumber;
  }

  get customerAddress(): string {
    return this._data.customerAddress;
  }

  get customerName(): string {
    return this._data.customerName;
  }

  get shippingAddress(): string {
    return this._data.shippingAddress;
  }

  get lineItems(): any {
    return this._data.lineItems;
  }

  get notes(): string {
    return this._data.notes;
  }

  set data(data: InvoiceData) {
    this._data = data;
  }

  static async transformToQuickBooksInvoice(
    invoice: Invoice,
  ): Promise<Invoice_Quickbooks> {
    const transformedInvoice: Invoice_Quickbooks = {
      id: invoice.id,
      created_at: invoice.createdAt,
      file_url: invoice.fileUrl,
      status: invoice.status,
      data: {
        supplierName: invoice.supplierName,
        vendorId: invoice.data.supplierName,
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date,
        dueDate: invoice.dueDate,
        customerAddress: invoice.customerAddress,
        notes: invoice.notes,
        lineItems: invoice.lineItems.map((item: LineItem_QuickBooks) => ({
          ...item,
          customerId: '',
          billable: false,
          accountId: '',
        })),
      },
    };

    return transformedInvoice;
  }
}

export default Invoice;
