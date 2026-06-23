import { expect, test } from '@playwright/test';

test('lead reviewer can resolve a disagreement', async ({ page }) => {
  await page.goto('/lead-review');

  await expect(page.getByRole('heading', { name: /lead review/i })).toBeVisible();
  await expect(page.getByText(/reviewer votes/i)).toBeVisible();

  await page.getByRole('button', { name: /choose response a/i }).click();
  await page
    .getByLabel(/decision note/i)
    .fill('Response A is safer and has stronger escalation guidance.');
  await page.getByRole('button', { name: /approve decision/i }).click();

  await expect(page.getByText(/no tasks currently need lead review/i)).toBeVisible();
});
