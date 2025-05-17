
export class Requisition {
  id: string;
  created: string;
  redirect: string;
  status: string;
  institutionId: string;
  agreement: string;
  reference: string;
  accounts: Array<string>;
  link: string;
  ssn: string | null;
  accountSelection: boolean;
  redirectImmediate: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.created = data.created;
    this.redirect = data.redirect;
    this.status = data.status;
    this.institutionId = data.institution_id;
    this.agreement = data.agreement;
    this.reference = data.reference;
    this.accounts = data.accounts || [];
    this.link = data.link;
    this.ssn = data.ssn;
    this.accountSelection = data.account_selection;
    this.redirectImmediate = data.redirect_immediate;
  }
}