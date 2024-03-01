import {expect} from 'detox';
import {describe, it, beforeEach} from '@jest/globals';
import {login} from './utils/utils';

describe('Rush shows page', () => {
  beforeEach(login);

  it('can see the expected shows', async () => {
    // check the initial state of the email screen
    await expect(element(by.text('Hamilton'))).not.toBeVisible();
    await expect(element(by.text('Guys & Dolls'))).toBeVisible();
    await expect(element(by.text('SIX the Musical'))).toBeVisible();
    await expect(element(by.text('Wicked'))).toBeVisible();

    const tinaShowName = element(by.text('Tina'));
    await expect(tinaShowName).not.toBeVisible();

    await element(by.id('rushShows')).scroll(400, 'down');
    await expect(tinaShowName).toBeVisible();
  });
});
