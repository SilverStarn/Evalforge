import { expect, test } from '@playwright/test';

test('task queue can be filtered by status', async ({ page }) => {
  await page.goto('/tasks');

  await page.getByLabel(/filter by status/i).selectOption('needs_review');
  await expect(page.getByText('t-1002')).toBeVisible();
  await expect(page.getByText('t-1001')).not.toBeVisible();
});
