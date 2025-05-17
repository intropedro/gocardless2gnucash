// Utilities to authenticate and fetch data from GoCardless Bank Account Data
import * as dotenv from 'dotenv';
import { updateEnv } from '../utils/env';
import { TokenResponse } from './models/TokenResponse';
import { TokenRefreshResponse } from './models/TokenRefreshResponse';
import { Institution } from './models/Institution';
import { Account } from './models/Account';
import { Transaction } from './models/Transaction';
import { Requisition } from './models/Requisition';

const API_BASE = 'https://bankaccountdata.gocardless.com/api/v2';

/**
 * Requests a new token from the API
 */
async function requestNewToken(): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE}/token/new/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      secret_id: process.env.GOCARDLESS_CLIENT_ID!,
      secret_key: process.env.GOCARDLESS_CLIENT_SECRET!,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to request new token: ${response.statusText}`);
  }

  const data = await response.json();
  return new TokenResponse(data);
}

/**
 * Refreshes an existing token
 */
async function refreshExistingToken(refreshToken: string): Promise<TokenRefreshResponse> {
  const response = await fetch(`${API_BASE}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  const data = await response.json();
  return new TokenRefreshResponse(data);
}

/**
 * Gets a valid token (renews if it is about to expire)
 */
export async function getValidToken(): Promise<string> {
  let accessToken = process.env.GOCARDLESS_ACCESS_TOKEN!;
  let refreshToken = process.env.GOCARDLESS_REFRESH_TOKEN!;
  let expiresAccessIn = Number(process.env.GOCARDLESS_ACCESS_TOKEN_EXPIRES_AT) || 0;
  const now = Math.floor(Date.now() / 1000);

  if (!accessToken || now >= expiresAccessIn - 60) {
    let tokenData;
    if (!accessToken) {
      // Request a new token
      console.log('No access token found. Requesting a new one...');
      tokenData = await requestNewToken();
      accessToken = tokenData.accessToken;
      expiresAccessIn = now + tokenData.expiresAccessIn;
      refreshToken = tokenData.refreshToken;
    } else {
      // Refresh the existing token
      console.log('Access token expired. Refresh ...');
      tokenData = await refreshExistingToken(refreshToken);
      accessToken = tokenData.accessToken;
      expiresAccessIn = now + tokenData.expiresAccessIn;
    }

    // Save new tokens and expiration to .env
    updateEnv({
      GOCARDLESS_ACCESS_TOKEN: accessToken,
      GOCARDLESS_ACCESS_TOKEN_EXPIRES_AT: expiresAccessIn.toString(),
      GOCARDLESS_REFRESH_TOKEN: refreshToken,
    });
  }

  return accessToken;
}

/**
 * Get account for the given id
 */
export async function getAccount(accessToken: string, id: string): Promise<Account> {
  const response = await fetch(`${API_BASE}/accounts/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to recover accounts: ${response.statusText}`);
  }

  const data = await response.json();
  return new Account(data);
}

/**
 * Get accounts for the given ids
 */
export async function getAccounts(accessToken: string, ids: Array<string>): Promise<Array<Account>> {
  const accounts = await Promise.all(
    ids.map(async (accountId: string) => {
      const account = await getAccount(accessToken, accountId);
      return account;
    })
  );
  return accounts;
}

/**
 * Fetches institutions from the GoCardless API
 */
export async function getInstitutions(accessToken: string): Promise<Array<Institution>> {
  const response = await fetch(`${API_BASE}/institutions`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch institutions: ${response.statusText}`);
  }

  const data = await response.json();
  return data.map((institution: any) => new Institution(institution));
}

/**
 * Fetches transactions for an account within a date range
 */
export async function getTransactions(
  accessToken: string,
  accountId: string,
): Promise<Array<any>> {
  const currentDate = new Date();
  const dateTo = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const dateFrom = new Date();
  dateFrom.setDate(currentDate.getDate() - 90); // Subtract 90 days
  const formattedDateFrom = dateFrom.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  console.log('Fetching transactions from ', formattedDateFrom, ' to ', dateTo);

  const url = new URL(`${API_BASE}/accounts/${accountId}/transactions`);
  url.searchParams.append('date_from', formattedDateFrom);
  url.searchParams.append('date_to', dateTo);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to recover accounts: ${response.statusText}`);
  }

  const data = await response.json();
  // data.transactions.booked
  // data.transactions.pending
  return data.transactions.booked.map((transaction: any) => new Transaction(transaction));
}

/**
 * Fetches agreements from the GoCardless API
 */
export async function getAgreements(accessToken: string): Promise<Array<any>> {
  const response = await fetch(`${API_BASE}/agreements/enduser`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(`Failed to fetch agreements: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data.agreements;
}

/**
 * Fetches requisitions from the GoCardless API
 */
export async function getRequisitions(accessToken: string): Promise<Array<any>> {
  const response = await fetch(`${API_BASE}/requisitions`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch requisitions: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results.map((requisition: any) => new Requisition(requisition));;
}

/**
 * Creates a requisition in the GoCardless API
 */
export async function createRequisition(
  accessToken: string,
  institutionId: string,
): Promise<any> {
  const response = await fetch(`${API_BASE}/requisitions/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      redirect: 'https://example.com/redirect',
      institution_id: institutionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create requisition: ${response.statusText}`);
  }

  const data = await response.json();
  return new Requisition(data);
}
