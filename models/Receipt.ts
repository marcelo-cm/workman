import { UUID } from 'crypto';
import { PredictResponse } from 'mindee';
import { ReceiptV5 } from 'mindee/src/product';
import { ReceiptV5LineItem } from 'mindee/src/product/receipt/receiptV5LineItem';

import { scanReceiptByURL } from '@/lib/hooks/useMindee';

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

  public set data(data: ReceiptData) {
    this._data = data;
  }

  static async scan(fileUrl: string) {
    const res = await scanReceiptByURL(fileUrl);
    const data = JSON.parse(res);
    const parsedData = await this.parse(data);

    return parsedData;
  }

  static async parse(data: PredictResponse<ReceiptV5>) {
    const prediction = data.document.inference.prediction;

    const extractedData: ReceiptData = {
      category: prediction?.category?.value || '',
      date: prediction?.date?.value || '',
      lineItems: prediction?.lineItems.map((item: ReceiptV5LineItem) => ({
        confidence: item.confidence,
        description: item?.description ?? '',
        totalAmount: item.totalAmount?.toFixed(2) ?? '0.00',
      })),
      subcategory: prediction?.subcategory?.value || '',
      supplierName: prediction?.supplierName?.value || '',
      time: prediction?.time?.value || '',
      tip: prediction?.tip?.value || 0,
      totalAmount: prediction?.totalAmount?.value || 0,
      totalNet: prediction?.totalNet?.value || 0,
      totalTax: prediction?.totalTax?.value?.toFixed(2) || '0.00',
    };

    return extractedData;
  }
}
