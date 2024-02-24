import {close} from '../../../mock-server/server';

export default async () => {
  try {
    // if running locally, close the mock server
    if (process.env.NODE_ENV === 'DEV') await close();
  } finally {
    await require('detox/runners/jest').globalTeardown();
  }
};
