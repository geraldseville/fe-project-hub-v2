import { expect, test } from '@playwright/test';

import { USER_EMAIL, USER_PASS } from '../auth.setup';

test('user can logout', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email Address').fill(USER_EMAIL);

  await page.getByLabel('Password', { exact: true }).fill(USER_PASS);

  await page
    .getByRole('button', {
      name: 'Sign In',
    })
    .click();

  await expect(page).toHaveURL('/dashboard');

  await page
    .getByRole('button', {
      name: 'Logout',
    })
    .click();

  await expect(page).toHaveURL('/auth/login');
});
