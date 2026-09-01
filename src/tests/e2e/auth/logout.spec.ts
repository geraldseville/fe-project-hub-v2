import { expect, test } from '@playwright/test';

const userEmail = 'sabrinacarpenter@gmail.com';
const userPass = 'it%196LkK9CevgAl';

test('user can logout', async ({ page }) => {
  // Login
  await page.goto('/auth/login');

  await page.getByLabel('Email Address').fill(userEmail);

  await page.getByLabel('Password', { exact: true }).fill(userPass);

  await page
    .getByRole('button', {
      name: 'Sign In',
    })
    .click();

  await expect(page).toHaveURL('/dashboard');

  // Logout
  await page
    .getByRole('button', {
      name: 'Logout',
    })
    .click();

  await expect(page).toHaveURL('/auth/login');
});
