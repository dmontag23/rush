export enum TodayTixClient {
  IOS = "ios"
}

export enum TodayTixGrantType {
  Refresh = "refresh_token"
}

export type TodayTixRefreshTokenReq = {
  client_id: TodayTixClient;
  grant_type: TodayTixGrantType;
  parent_token: string;
  refresh_token: string;
};

export type TodayTixRefreshTokenRes = {
  access_token: string;
  token_type: string;
  original_token_id: string;
  expires_in: number;
  scope: string;
};
