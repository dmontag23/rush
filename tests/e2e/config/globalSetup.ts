import {listen} from '../../../mock-server/server';

export default async () => {
  await require('detox/runners/jest').globalSetup();
  // if running locally start the mock server
  if (process.env.NODE_ENV === 'DEV') await listen();
};
