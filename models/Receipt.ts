import { UUID } from 'crypto';
import { ChatCompletion } from 'openai/resources/index.mjs';

import { toast } from '@/components/ui/use-toast';

import { scanReceiptByURL } from '@/lib/hooks/useOpenAI';

import { Bill } from '@/app/api/v1/quickbooks/company/bill/interfaces';
import { ReceiptStatus } from '@/constants/enums';
import { ReceiptData } from '@/interfaces/common.interfaces';
import { createClient } from '@/lib/utils/supabase/client';

import { Company } from './Company';
import { User_Nested } from './User';

const supabase = createClient();

export class Receipt {
  private _id: UUID;
  private _created_at: Date;
  private _data: ReceiptData;
  private _file_url: string;
  private _status: ReceiptStatus;
  private _principal: User_Nested;
  private _company: Company;

  constructor({
    id,
    created_at,
    data,
    file_url,
    status,
    principal,
    company,
  }: {
    id: UUID;
    created_at: Date;
    data: ReceiptData;
    file_url: string;
    status: ReceiptStatus;
    principal: User_Nested;
    company: Company;
  }) {
    this._id = id;
    this._created_at = new Date(created_at);
    this._data = data;
    this._file_url = file_url;
    this._status = status;
    this._principal = principal;
    this._company = company;
  }

  public get id(): UUID {
    return this._id;
  }

  public get createdAt(): Date {
    return this._created_at;
  }

  public get data(): ReceiptData {
    return this._data;
  }

  public get fileUrl(): string {
    return this._file_url;
  }

  public get status(): ReceiptStatus {
    return this._status;
  }

  public get principal(): User_Nested {
    return this._principal;
  }

  public get company(): Company {
    return this._company;
  }

  public get fileName(): string {
    return decodeURI(this._file_url.split('/').pop()?.split('.')[0] || '');
  }

  public get isApproved(): boolean {
    return this._status === ReceiptStatus.APPROVED;
  }

  public set data(data: ReceiptData) {
    this._data = data;
  }

  public set status(status: ReceiptStatus) {
    this._status = status;
  }

  static async create(file_url: string, data?: ReceiptData): Promise<Receipt> {
    const { data: receipt, error } = await supabase
      .from('receipts')
      .insert({
        data,
        file_url,
      })
      .select('*')
      .single();

    if (error || !receipt) {
      toast({
        title: 'Failed to create receipt',
        variant: 'destructive',
      });
      throw new Error(`Failed to create receipt: ${error?.message}`);
    }

    toast({
      title: 'Successfully created receipt',
      variant: 'success',
    });

    return new Receipt(receipt);
  }

  static async scan(fileUrl: string) {
    const res = await scanReceiptByURL(fileUrl);
    const data: ChatCompletion = JSON.parse(res);
    if (!data.choices[0].message.content) {
      throw new Error('No response from OpenAI API');
    }
    const receiptData: ReceiptData = JSON.parse(
      data.choices[0].message.content,
    );

    return receiptData;
  }

  static async updateData(receipt: Receipt, data: ReceiptData) {
    console.log('updating data', data);
    const { data: updatedData, error } = await supabase
      .from('receipts')
      .update({ data })
      .eq('id', receipt.id)
      .select('data');

    if (error) {
      toast({
        title: `Failed to update data for ${receipt.fileName}`,
        variant: 'destructive',
      });
      throw new Error(`Failed to update receipt data: ${error.message}`);
    }

    toast({
      title: `Successfully updated data for ${receipt.fileName}`,
      variant: 'success',
    });

    return updatedData;
  }

  async updateData(data: ReceiptData) {
    Receipt.updateData(this, data);
  }

  async approve() {
    const { data, error } = await supabase
      .from('receipts')
      .update({ status: ReceiptStatus.APPROVED })
      .eq('id', this.id)
      .select('*')
      .single();

    if (error || !data) {
      toast({
        title: `Failed to approve ${this.fileName}`,
        variant: 'destructive',
      });
      throw new Error(`Failed to approve receipt: ${error?.message}`);
    }

    toast({
      title: `Successfully approved ${this.fileName}`,
      variant: 'success',
    });

    return new Receipt(data);
  }

  async process() {
    const { data, error } = await supabase
      .from('receipts')
      .update({ status: ReceiptStatus.PROCESSED })
      .eq('id', this.id)
      .select('*')
      .single();

    if (error || !data) {
      toast({
        title: `Failed to process ${this.fileName}`,
        variant: 'destructive',
      });
      throw new Error(`Failed to process receipt: ${error?.message}`);
    }

    toast({
      title: `Successfully processed ${this.fileName}`,
      variant: 'success',
    });

    return new Receipt(data);
  }

  async uploadToQuickBooks(bill: Bill) {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error('User not found');
    }

    const userId = data.user.id;
    const body = {
      userId,
      bill,
    };

    const response = await fetch('/api/v1/quickbooks/company/receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (response.ok) {
      this.process();
      return responseData;
    } else {
      toast({
        title: 'Failed to upload to QuickBooks',
        variant: 'destructive',
      });
      throw new Error(
        `Failed to upload to QuickBooks: ${responseData.message}`,
      );
    }
  }

  /**
   * This is a helper function to parse the response from the Mindee API into a ReceiptData object.
   * @param data Response from Mindee API to be parsed into a ReceiptData object
   */
  static async parse(data: any) {}
}
