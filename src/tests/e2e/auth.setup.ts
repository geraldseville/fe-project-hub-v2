import { expect, test as setup } from '@playwright/test';

export const USER_FULL_NAME = 'Gerald Seville';
export const USER_EMAIL = 'geraldseville@gmail.com';
export const USER_PASS = '$8XZSE!dRaB3ydS%r6gtlD%h';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  console.log('Starting authentication...');

  await page.goto('/auth/login');

  console.log('Login page loaded:', page.url());

  await page.getByLabel('Email Address').fill(USER_EMAIL);

  await page.getByLabel('Password', { exact: true }).fill(USER_PASS);

  await page
    .getByRole('button', {
      name: 'Sign In',
    })
    .click();

  console.log('Clicked Sign In');

  await expect(page).toHaveURL('/dashboard');

  console.log('Authentication successful:', page.url());

  await page.context().storageState({
    path: authFile,
  });

  console.log('Storage state created:', authFile);
});
