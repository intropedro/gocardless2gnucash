export class TokenResponse {
  accessToken: string;
  expiresAccessIn: number;
  refreshToken: string;
  expiresRefreshIn: number;

  constructor(data: any) {
    this.accessToken = data.access;
    this.expiresAccessIn = data.access_expires;
    this.refreshToken = data.refresh;
    this.expiresRefreshIn = data.refresh_expires;
  }
}