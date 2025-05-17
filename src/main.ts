// Main orchestrator that uses the modules to generate the OFX from GoCardless
import * as dotenv from 'dotenv';
import { getValidToken, getAccount, getTransactions, getInstitutions, getAgreements, getRequisitions, createRequisition, getAccounts } from './gocardless/gocardless-api';
import { createOfxStructure, saveOfx } from './ofx/ofx';
import { createTerminal, promptRequest } from './utils/terminal';
import { Account } from './gocardless/models/Account';
import { OFXTransaction } from './ofx/models/ofx-transaction';
import { mapToOfx } from './ofx/models/transaction-to-ofx-adapter';

const terminal = createTerminal();
dotenv.config();

async function listAccounts() {
    const token = await getValidToken();

    const requisitions = await getRequisitions(token);
    const accountsIds = requisitions.reduce((accounts, requisition) => [...accounts, ...requisition.accounts], []);

    const accounts = await getAccounts(token, accountsIds);
    accounts.forEach((account: Account) => {
        console.log(`${account.name} - ${account.ownerName} - ${account.iban}`);
    });
    return accounts;
}

async function addAccounts() {
    const token = await getValidToken();
    const institutions = await getInstitutions(token);
    console.log(institutions);
    institutions.forEach((institution, index) => {
        console.log(`${index + 1} - ${institution.name}`);
    });

    const answer = await promptRequest(terminal, ['\nSelect an institution by index: ']);
    const index = !!answer ? (parseInt(answer, 10) - 1) : -1;

    const institution = institutions[index];
    if (!!institution) {
        console.log('Selected Institution:', institution.name);
        // 1514 - Sandbox Finance
        // 1515 - Sandbox Finance
        // 1516 - Sandbox Finance
        const requisition = await createRequisition(token, institution.id);
        console.log(`Access the link to add the account: ${requisition.link}`);
    } else {
        console.log('❌ Invalid institution.');
    }
}

async function exportMovements() {
    const token = await getValidToken();

    const accounts = await listAccounts();

    for (const account of accounts) {
        const transactions = await getTransactions(token, account.id);

        const ofxTransaction: Array<OFXTransaction> = mapToOfx(transactions);
        const ofx = createOfxStructure('', account.iban, ofxTransaction);

        // Sanitize account name and IBAN for the file name
        const sanitizedAccountName = account.name.replace(/[^a-zA-Z0-9]/g, '_');
        const sanitizedIban = account.iban.replace(/[^a-zA-Z0-9]/g, '');
        const fileName = `movements_${sanitizedAccountName}_${sanitizedIban}.ofx`;

        saveOfx(ofx, fileName);
    }
}

async function menu() {
    const options = [
        { key: '1', name: 'List accounts', action: async () => listAccounts() },
        { key: '2', name: 'Add account', action: async () => addAccounts() },
        { key: '3', name: 'Export movements', action: async () => exportMovements() },
        { key: '0', name: 'Exit', action: async () => { terminal.close(); process.exit(0); } }
    ];

    while (true) {
        // Show menu
        const answer = await promptRequest(terminal, [
            '=== Menu ===',
            ...options.map(opt => `${opt.key} - ${opt.name}`),
            'Select option: ',
        ]);
        const match = options.find(opt => opt.key === answer);

        if (match) {
            await match.action();
        } else {
            console.log('❌ Option invalid.');
        }
    }
}

menu();
