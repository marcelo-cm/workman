import { UUID } from 'crypto';

export class Company {
  private _id: UUID;
  private _name: string;
  private _created_at: Date;

  constructor({
    id,
    name,
    created_at,
  }: {
    id: UUID;
    name: string;
    created_at: string;
  }) {
    this._id = id;
    this._name = name;
    this._created_at = new Date(created_at);
  }

  get id(): UUID {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get created_at(): Date {
    return this._created_at;
  }
}
