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
