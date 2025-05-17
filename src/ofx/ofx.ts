// Utilities to map transactions to OFX and save the file
import { create } from 'xmlbuilder2';
import * as fs from 'fs';
import * as path from 'path';
import { OFXTransaction } from './models/ofx-transaction';

/**
 * Generates OFX XML from transactions and account data
 */
export function createOfxStructure(
  bic: string,
  iban: string,
  transactions: Array<OFXTransaction>,
) {

  // Corvert now to format 20250516172748
  const now = new Date();
  const dtServer = now.toISOString().replace(/[-:T]/g, '').split('.')[0].slice(0, 14); // Format: YYYYMMDDHHMMSS

  const firstTransaction = transactions[0];
  const lastTransaction = transactions[transactions.length - 1];
  
  const ofxObj = {
    OFX: {
      SIGNONMSGSRSV1: {
        SONRS: {
          STATUS: { CODE: '0', SEVERITY: 'INFO' },
          DTSERVER: dtServer,
          LANGUAGE: 'ENG'
        }
      },
      BANKMSGSRSV1: {
        STMTTRNRS: {
          TRNUID: '1',
          STATUS: { CODE: '0', SEVERITY: 'INFO' },
          STMTRS: {
            CURDEF: 'EUR',
            BANKACCTFROM: {
              // BANKID: bic || '',
              ACCTID: iban,
              ACCTTYPE: 'CHECKING'
            },
            BANKTRANLIST: {
              DTSTART: lastTransaction.DTPOSTED,
              DTEND: firstTransaction.DTPOSTED,
              STMTTRN: transactions
            }
          }
        }
      }
    }
  };
  return create(ofxObj).end({ prettyPrint: true });
}

/**
 * Saves the OFX XML to a file
 */
export function saveOfx(xml: string, file: string) {
  const outDir = path.resolve(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const filePath = path.join(outDir, file);
  fs.writeFileSync(filePath, xml);
  console.log(`OFX file generated at: ${filePath}`);
}