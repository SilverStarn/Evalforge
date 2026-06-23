import { expect, test } from '@playwright/test';

test('reviewer can complete a review task', async ({ page }) => {
  await page.goto('/review/t-1001');

  await expect(page.getByRole('heading', { name: /review task/i })).toBeVisible();
  await page.getByRole('button', { name: /choose response a/i }).click();
  await page.getByRole('slider', { name: /confidence/i }).fill('90');
  await page.getByRole('button', { name: '5' }).first().click();
  await page.getByRole('button', { name: '4' }).nth(1).click();
  await page.getByRole('button', { name: '5' }).nth(2).click();
  await page.getByRole('checkbox').first().check();
  await page
    .getByLabel(/reviewer rationale/i)
    .fill('Response A is accurate and Response B contains rendering errors.');
  await page.getByRole('button', { name: /submit review/i }).click();

  await expect(page.getByText(/review submitted/i)).toBeAttached();
});
