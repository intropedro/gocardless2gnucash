export class TokenRefreshResponse {
  accessToken: string;
  expiresAccessIn: number;

  constructor(data: any) {
    this.accessToken = data.access;
    this.expiresAccessIn = data.access_expires;
  }
}