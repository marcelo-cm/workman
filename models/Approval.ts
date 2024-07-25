import { UUID } from 'crypto';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { User, User_Nested } from './User';

const { getUserById } = useUser();

export class Approval {
  private _id: UUID;
  private _approver: User_Nested;
  private _principal: User_Nested;
  private _approvable_id: UUID;
  private _approvable_type: string;
  private _status: string;
  private _removable: boolean;
  private _created_at: Date;

  constructor({
    id,
    approver,
    principal,
    approvable_id,
    approvable_type,
    status,
    removable,
    created_at,
  }: {
    id: UUID;
    approver: User_Nested;
    principal: User_Nested;
    approvable_id: UUID;
    approvable_type: string;
    status: string;
    removable: boolean;
    created_at: string;
  }) {
    this._id = id;
    this._approver = new User_Nested(approver);
    this._principal = new User_Nested(principal);
    this._approvable_id = approvable_id;
    this._approvable_type = approvable_type;
    this._status = status;
    this._removable = removable;
    this._created_at = new Date(created_at);
  }

  get id(): UUID {
    return this._id;
  }

  get approver(): User_Nested {
    return this._approver;
  }

  get principal(): User_Nested {
    return this._principal;
  }

  get approvableId(): UUID {
    return this._approvable_id;
  }

  get approvableType(): string {
    return this._approvable_type;
  }

  get status(): string {
    return this._status;
  }

  get removable(): boolean {
    return this._removable;
  }

  get createdAt(): Date {
    return this._created_at;
  }
}
