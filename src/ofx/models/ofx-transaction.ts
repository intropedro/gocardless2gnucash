export interface OFXTransaction {
  FITID: string;
  TRNTYPE: 'DEBIT' | 'CREDIT';
  DTPOSTED: string;
  TRNAMT: string;
  NAME: string;
  MEMO?: string;
}