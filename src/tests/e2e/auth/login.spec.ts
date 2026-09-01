import { expect, test } from '@playwright/test';

const userEmail = 'sabrinacarpenter@gmail.com';
const userPass = 'it%196LkK9CevgAl';

test('login user successfully', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email Address').fill(userEmail);

  await page.getByLabel('Password', { exact: true }).fill(userPass);

  await page.getByText('Stay signed up for 30 days').click();

  await page
    .getByRole('button', {
      name: 'Sign In',
    })
    .click();

  await expect(page).toHaveURL('/dashboard');
});

test('login user with wrong credentials', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email Address').fill(userEmail);

  await page
    .getByLabel('Password', { exact: true })
    .fill('asdasdadad123123asd');

  await page.getByText('Stay signed up for 30 days').click();

  await page
    .getByRole('button', {
      name: 'Sign In',
    })
    .click();

  await expect(page.getByText('Invalid email or password')).toBeVisible();
});
