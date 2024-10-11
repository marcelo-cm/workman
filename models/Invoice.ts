import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import { UUID } from 'crypto';

import { toast } from '@/components/ui/use-toast';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { PDFData } from '@/app/api/v1/gmail/messages/route';
import { InvoiceStatus } from '@/constants/enums';
import { InvoiceData } from '@/interfaces/common.interfaces';
import {
  Invoice_Quickbooks,
  LineItem_QuickBooks,
} from '@/interfaces/quickbooks.interfaces';
import { mindeeScan } from '@/lib/actions/actions';
import { createClient } from '@/lib/utils/supabase/client';

import { Company } from './Company';
import { User_Nested } from './User';

const supabase = createClient();
const { fetchUserData } = useUser();

export class Invoice {
  private _id: UUID;
  private _created_at: Date;
  private _data: InvoiceData;
  private _file_url: string;
  private _status: InvoiceStatus;
  private _principal: User_Nested;
  private _company: Company;

  constructor({
    id,
    created_at,
    data,
    status,
    file_url,
    principal,
    company,
  }: {
    id: UUID;
    created_at: Date;
    data: InvoiceData;
    status: InvoiceStatus;
    file_url: string;
    principal: User_Nested;
    company: Company;
  }) {
    this._id = id;
    this._created_at = new Date(created_at);
    this._data = data;
    this._status = status;
    this._file_url = file_url;
    this._principal = new User_Nested(principal);
    this._company = new Company(company);
  }

  /**
   * This function uploads a file to the storage bucket in supabase
   * @param file The file to upload to storage
   * @returns The public URL of the uploaded file
   */
  static async uploadToStorage(file: File | PDFData): Promise<string> {
    let filePath, fileBody: File | ArrayBuffer;

    if (file instanceof File) {
      filePath = `/${file.name}_${new Date().getTime()}`;
      fileBody = file;
    } else {
      filePath = `/${file.filename}_${new Date().getTime()}`;
      fileBody = decode(file.base64);
    }

    const { data, error } = await supabase.storage
      .from('invoices')
      .upload(filePath, fileBody);

    if (error) {
      toast({
        title: `Failed to upload ${file instanceof File ? file.name : decodeURI(file.filename)}`,
        description: 'Please try to upload this document again',
        variant: 'destructive',
      });
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    toast({
      title: `${file instanceof File ? file.name : decodeURI(file.filename)} uploaded to storage successfully`,
      variant: 'success',
    });

    const {
      data: { publicUrl },
    } = await supabase.storage.from('invoices').getPublicUrl(data.path);

    return publicUrl;
  }

  static async create(file_url: string, data?: InvoiceData): Promise<Invoice> {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        data,
        file_url,
      })
      .select('*, principal: users(name, email, id), company: companies(*)')
      .single();

    if (error || !invoice) {
      toast({
        title: 'Failed to create invoice',
        variant: 'destructive',
      });
      throw new Error(`Failed to create invoice: ${error?.message}`);
    }

    toast({
      title: 'Invoice created',
      variant: 'success',
    });

    return new Invoice(invoice);
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

  async update(data: InvoiceData) {
    console.log('c% ---- Updating invoice ----', 'color: #ff0088');
    const { data: updatedInvoice, error }: PostgrestSingleResponse<Invoice> =
      await supabase
        .from('invoices')
        .update({ data })
        .eq('id', this.id)
        .select('*, principal: users(name, email, id), company: companies(*)')
        .single();

    if (error) {
      toast({
        title: `Failed to updating file`,
        variant: 'destructive',
      });
      throw new Error(`Failed to update invoice: ${error.message}`);
    }

    console.log('updatedInvoice', updatedInvoice);

    toast({
      title: `Invoice has been updated`,
      variant: 'success',
    });

    return updatedInvoice;
  }

  async delete() {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', this.id);

    if (error) {
      toast({
        title: `Failed to delete invoice`,
        description: 'Please try again later',
        variant: 'destructive',
      });
      throw new Error(`Failed to delete invoice: ${error.message}`);
    }

    toast({
      title: `Invoice deleted`,
      variant: 'success',
    });
  }

  async process() {
    const { id } = await fetchUserData();
    const fileUrl = this.fileUrl;

    if (!id) {
      toast({
        title: 'User ID not found',
        description: 'Please try again later',
        variant: 'destructive',
      });
      throw new Error('User ID not found');
    }

    if (!fileUrl) {
      toast({
        title: 'File URL not found',
        description: 'Please try again later',
        variant: 'destructive',
      });
      throw new Error('File URL not found');
    }

    const response = await fetch(`/api/v1/workman/bill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileURLs: [fileUrl],
        invoiceId: this.id,
        userId: id,
      }),
    });

    if (!response.ok) {
      toast({
        title: 'Failed to process invoice',
        description: 'Please try again later',
        variant: 'destructive',
      });
      return;
    }

    const responseData = await response.json();

    toast({
      title: 'Invoice processed',
      description: responseData.message,
      variant: 'success',
    });

    this.updateStatus(InvoiceStatus.FOR_REVIEW);

    return responseData;
  }

  async updateStatus(status: InvoiceStatus) {
    if (status === this.status) {
      return;
    }

    const { data, error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', this.id)
      .select('*');

    if (error) {
      toast({
        title: `Failed to update invoice status`,
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  }

  get id(): UUID {
    return this._id;
  }

  get createdAt(): Date {
    return this._created_at;
  }

  get data(): InvoiceData {
    return this._data;
  }

  get fileUrl(): string {
    return this._file_url;
  }

  get principal(): User_Nested {
    return this._principal;
  }

  get company(): Company {
    return this._company;
  }

  get status(): InvoiceStatus {
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

  get fileName(): string {
    return this._file_url.split('/').pop()?.split('.pdf')[0] || '';
  }

  set data(data: InvoiceData) {
    this._data = data;
  }

  set status(status: InvoiceStatus) {
    this._status = status;
  }

  static async transformToQuickBooksInvoice(
    invoice: Invoice,
  ): Promise<Invoice_Quickbooks> {
    const transformedInvoice: Invoice_Quickbooks = {
      id: invoice.id,
      created_at: String(invoice.createdAt),
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
