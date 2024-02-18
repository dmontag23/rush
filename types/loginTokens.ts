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
