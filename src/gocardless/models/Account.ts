
export class Account {
  id: string;
  created: string;
  lastAccessed: string;
  iban: string;
  institutionId: string;
  status: string;
  ownerName: string;
  bban: string | null;
  name: string;

  constructor(data: any) {
    this.id = data.id;
    this.created = data.created;
    this.lastAccessed = data.last_accessed;
    this.iban = data.iban;
    this.institutionId = data.institution_id;
    this.status = data.status;
    this.ownerName = data.owner_name;
    this.bban = data.bban;
    this.name = data.name;
  }
}