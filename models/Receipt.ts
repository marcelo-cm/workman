import { UUID } from 'crypto';
import { PredictResponse } from 'mindee';
import { ReceiptV5 } from 'mindee/src/product';
import { ReceiptV5LineItem } from 'mindee/src/product/receipt/receiptV5LineItem';
import { ChatCompletion } from 'openai/resources/index.mjs';

import { scanReceiptByURL } from '@/lib/hooks/useOpenAI';

import { ReceiptStatus } from '@/constants/enums';
import { ReceiptData } from '@/interfaces/common.interfaces';

import { Company } from './Company';
import { User_Nested } from './User';

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
    return this._file_url.split('/').pop() || '';
  }

  public set data(data: ReceiptData) {
    this._data = data;
  }

  static async scan(fileUrl: string) {
    const res = await scanReceiptByURL(
      'https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/receipts/UberReceipt.png?t=2024-09-07T17%3A15%3A59.554Z',
    );
    const data: ChatCompletion = JSON.parse(res);
    if (!data.choices[0].message.content) {
      throw new Error('No response from OpenAI API');
    }
    const receiptData: ReceiptData = JSON.parse(
      data.choices[0].message.content,
    );

    return receiptData;
  }

  /**
   * This is a helper function to parse the response from the Mindee API into a ReceiptData object.
   * @param data Response from Mindee API to be parsed into a ReceiptData object
   */
  static async parse(data: any) {
    const prediction = data.document.inference.prediction;
    const extractedData: ReceiptData = {
      category: prediction?.category?.value || '',
      date: prediction?.date?.value || '',
      lineItems: prediction?.lineItems.map((item: ReceiptV5LineItem) => ({
        confidence: item.confidence,
        description: item?.description ?? '',
        totalAmount: item.totalAmount?.toFixed(2) ?? '0.00',
      })),
      supplierName: prediction?.supplierName?.value || '',
      time: prediction?.time?.value || '',
      tip: prediction?.tip?.value || 0,
      totalAmount: prediction?.totalAmount?.value || 0,
      totalTax: prediction?.totalTax?.value?.toFixed(2) || '0.00',
      project: prediction?.project?.value || '',
    };
    return extractedData;
  }
}
