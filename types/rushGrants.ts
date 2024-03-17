export type TodayTixRushGrantsReq = {
  showId: number;
};

export type TodayTixRushGrant = {
  _type: string;
  dateGranted: string;
  showId: number;
  showName: string;
};
