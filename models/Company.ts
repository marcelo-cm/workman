import { UUID } from 'crypto';

export class Company {
  id: UUID;
  name: string;
  created_at: string;

  constructor({ id, name, created_at }: Company) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
  }
}
