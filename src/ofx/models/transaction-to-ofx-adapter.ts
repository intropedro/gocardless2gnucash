import { Transaction } from "../../gocardless/models/Transaction";
import { OFXTransaction } from "./ofx-transaction";

/**
 * Adapter class to transform a Transaction into an OFXTransaction
 */
export class TransactionToOFXAdapter {
  private transaction: Transaction;

  constructor(transaction: Transaction) {
    this.transaction = transaction;
  }

  toOFXTransaction(): OFXTransaction {
    const id = this.transaction.transactionId;
    const amount = parseFloat(this.transaction.transactionAmount.amount);
    const date = this.transaction.bookingDate.replace(/-/g, '');
    const name = this.transaction.creditorName || this.transaction.remittanceInformationUnstructured || 'Movement';
    const type = amount < 0 ? 'DEBIT' : 'CREDIT';
    return {
      FITID: id,
      TRNTYPE: type,
      DTPOSTED: date,
      TRNAMT: amount.toFixed(2),
      NAME: name,
    };
  }
}

/**
 * Maps an array of Transaction objects to an array of OFXTransaction objects
 */
export function mapToOfx(transactions: Transaction[]): Array<OFXTransaction> {
  return transactions.map(tx => new TransactionToOFXAdapter(tx).toOFXTransaction());
}