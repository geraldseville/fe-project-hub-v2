import { expect, test } from '@playwright/test';

import { USER_EMAIL, USER_PASS } from '../auth.setup';

test('create user but already exists', async ({ page }) => {
  await page.goto('/auth/register');

  await page.getByLabel('Full Name').fill('Sabrina Carpenter');

  await page.getByLabel('Email Address').fill(USER_EMAIL);

  await page.getByLabel('Password', { exact: true }).fill(USER_PASS);

  await page.getByLabel('Confirm Password').fill(USER_PASS);

  await page.locator('label[for="agreeTerms"]').click();

  await page
    .getByRole('button', {
      name: 'Create Account',
    })
    .click();

  await expect(
    page.getByText('user already exists with this email'),
  ).toBeVisible();
});

test('create user then redirect to dashboard', async ({ page }) => {
  const random = Date.now();

  const fullName = `Gerald Seville ${random}`;
  const email = `geraldseville+${random}@gmail.com`;
  const password = `Y^7IwLdTZZZVP0JC${random}`;

  await page.goto('/auth/register');

  await page.getByLabel('Full Name').fill(fullName);

  await page.getByLabel('Email Address').fill(email);

  await page.getByLabel('Password', { exact: true }).fill(password);

  await page.getByLabel('Confirm Password').fill(password);

  await page.locator('label[for="agreeTerms"]').click();

  await page
    .getByRole('button', {
      name: 'Create Account',
    })
    .click();

  await expect(page).toHaveURL('/dashboard');
});
