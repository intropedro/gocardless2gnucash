export class Institution {
  id: string;
  name: string;
  bic: string;
  transactionTotalDays: string;
  countries: Array<string>;
  logo: string;
  maxAccessValidForDays: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.bic = data.bic;
    this.transactionTotalDays = data.transaction_total_days;
    this.countries = data.countries;
    this.logo = data.logo;
    this.maxAccessValidForDays = data.max_access_valid_for_days;
  }
}