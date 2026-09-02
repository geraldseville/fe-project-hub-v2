import { expect, test as setup } from '@playwright/test';

export const USER_EMAIL = 'geraldseville@gmail.com';
export const USER_PASS = '$8XZSE!dRaB3ydS%r6gtlD%h';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email Address').fill(USER_EMAIL);

  await page.getByLabel('Password', { exact: true }).fill(USER_PASS);

  await page
    .getByRole('button', {
      name: 'Sign In',
    })
    .click();

  await expect(page).toHaveURL('/dashboard');

  await page.context().storageState({
    path: authFile,
  });
});
