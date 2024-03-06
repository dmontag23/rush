export type TodayTixLoginReq = {email: string};
export type TodayTixLoginRes = {};

export type TodayTixAccessTokensReq = {
  grantType: string;
  code: string;
  scope: string;
};
export type TodayTixAccessTokensRes = {
  _type: string;
  accessToken: string;
  tokenType: string;
  scope: string;
  refreshToken: string;
  expiresIn: number;
};

export type TodayTixRefreshTokenReq = {
  client_id: string;
  grant_type: string;
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
