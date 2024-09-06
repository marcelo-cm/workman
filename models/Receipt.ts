import { UUID } from 'crypto';

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
}
