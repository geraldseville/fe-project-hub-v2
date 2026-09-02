import { expect, test } from '@playwright/test';

test('user can cancel project creation using cancel button', async ({
  page,
}) => {
  await page.goto('/dashboard');

  await page
    .getByRole('button', {
      name: 'New Project',
    })
    .click();

  await expect(
    page.getByText('Set the core parameters for your new collaborative space.'),
  ).toBeVisible();

  const dialog = page.getByRole('dialog', {
    name: 'Create Project',
  });

  await dialog.locator('button[aria-label="Project Create"]').click();

  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: 'Cancel' }).click();
  // await dialog.locator('button[aria-label="Project Cancel"]').click();

  await expect(dialog).not.toBeVisible();
});

test('user can cancel project creation using close modal button', async ({
  page,
}) => {
  await page.goto('/dashboard');

  await page
    .getByRole('button', {
      name: 'New Project',
    })
    .click();

  await expect(
    page.getByText('Set the core parameters for your new collaborative space.'),
  ).toBeVisible();

  const dialog = page.getByRole('dialog', {
    name: 'Create Project',
  });

  await dialog.locator('button[aria-label="Project Create"]').click();

  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: 'Close modal' }).click();

  await expect(dialog).not.toBeVisible();
});

test('user can cancel project creation using outside modal', async ({
  page,
}) => {
  await page.goto('/dashboard');

  await page
    .getByRole('button', {
      name: 'New Project',
    })
    .click();

  await expect(
    page.getByText('Set the core parameters for your new collaborative space.'),
  ).toBeVisible();

  const dialog = page.getByRole('dialog', {
    name: 'Create Project',
  });

  await dialog.locator('button[aria-label="Project Create"]').click();

  await expect(dialog).toBeVisible();

  const box = await dialog.boundingBox();

  if (!box) {
    throw new Error('Dialog is not visible');
  }

  await page.mouse.click(box.x - 20, box.y + box.height / 2);

  await expect(dialog).not.toBeVisible();
});

test('user can create a required fields for project', async ({ page }) => {
  await page.goto('/dashboard');

  await page
    .getByRole('button', {
      name: 'New Project',
    })
    .click();

  await expect(
    page.getByText('Set the core parameters for your new collaborative space.'),
  ).toBeVisible();

  const dialog = page.getByRole('dialog', {
    name: 'Create Project',
  });

  await dialog.locator('button[aria-label="Project Create"]').click();

  await expect(dialog).toBeVisible();

  await dialog.getByLabel('Title').fill('Website Redesign');

  await dialog.locator('button[aria-label="Project Create"]').click();

  await expect(dialog.getByText('Start date is required')).toBeVisible();

  await expect(dialog.getByText('End date is required')).toBeVisible();

  await dialog
    .getByRole('combobox')
    .filter({ hasText: 'Select Start Date...' })
    .click();

  await page
    .getByRole('button', {
      name: 'September 06, 2026',
    })
    .click();

  await dialog
    .getByRole('combobox')
    .filter({ hasText: 'Select End Date...' })
    .click();

  await page
    .getByRole('button', {
      name: 'September 08, 2026',
    })
    .click();

  await dialog.locator('button[aria-label="Project Create"]').click();

  await expect(page).toHaveURL(/\/projects\/[^/]+$/);

  await expect(
    page.getByText('Project Overview', { exact: true }),
  ).toBeVisible();
});

test('user can create a project with all fields filled', async ({ page }) => {
  await page.goto('/dashboard');

  await page
    .getByRole('button', {
      name: 'New Project',
    })
    .click();

  await expect(
    page.getByText('Set the core parameters for your new collaborative space.'),
  ).toBeVisible();

  const dialog = page.getByRole('dialog', {
    name: 'Create Project',
  });

  await expect(dialog).toBeVisible();

  await dialog.getByLabel('Title').fill('Website Redesign');

  await dialog.getByLabel('Description').fill('This is a project description.');

  await dialog
    .getByRole('button', {
      name: 'Select color #f97316',
    })
    .click();

  await page.getByRole('combobox').filter({ hasText: 'PLANNING' }).click();

  await page
    .getByRole('button', {
      name: 'Select ACTIVE',
    })
    .click();

  await page.getByRole('combobox').filter({ hasText: 'LOW' }).click();

  await page
    .getByRole('button', {
      name: 'Select HIGH',
    })
    .click();

  await dialog
    .getByRole('combobox')
    .filter({ hasText: 'Select Start Date...' })
    .click();

  await page
    .getByRole('button', {
      name: 'September 06, 2026',
    })
    .click();

  await dialog
    .getByRole('combobox')
    .filter({ hasText: 'Select End Date...' })
    .click();

  await page
    .getByRole('button', {
      name: 'September 06, 2026',
    })
    .click();

  await page
    .getByRole('combobox')
    .filter({ hasText: 'Add Members...' })
    .click();

  const searchProjectMembers = page.locator(
    '#multi-select-search-project-members',
  );

  await searchProjectMembers.fill('John Doe');

  await searchProjectMembers.fill('');

  const memberIds = [
    'cmstm8rad0007356ukbdrjhax',
    'cmstm93gt000b356u1sapepee',
    'cmstm8lrx0005356u3an0yn9h',
  ];

  for (const memberId of memberIds) {
    await page.locator(`#multi-select-project-members-${memberId}`).click();
  }

  await dialog.locator('button[aria-label="Project Create"]').click();

  await expect(page).toHaveURL(/\/projects\/[^/]+$/);

  await expect(
    page.getByText('Project Overview', { exact: true }),
  ).toBeVisible();
});
