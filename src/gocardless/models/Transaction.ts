export class Transaction {
  transactionId: string;
  entryReference: string;
  bookingDate: string;
  valueDate: string;
  transactionAmount: { amount: string; currency: string };
  creditorName: string;
  remittanceInformationUnstructured: string;
  bankTransactionCode: string;
  proprietaryBankTransactionCode: string;
  internalTransactionId: string;

  constructor(data: any) {
    this.transactionId = data.transactionId;
    this.entryReference = data.entryReference;
    this.bookingDate = data.bookingDate;
    this.valueDate = data.valueDate;
    this.transactionAmount = data.transactionAmount;
    this.creditorName = data.creditorName;
    this.remittanceInformationUnstructured = data.remittanceInformationUnstructured;
    this.bankTransactionCode = data.bankTransactionCode;
    this.proprietaryBankTransactionCode = data.proprietaryBankTransactionCode;
    this.internalTransactionId = data.internalTransactionId;
  }
}