import { expect, test } from '@playwright/test';

test('main navigation and locale switcher are reachable', async ({ page }) => {
  await page.goto('/');

  const primaryNavigation = page.getByRole('navigation', { name: /primary navigation/i });
  if (!(await primaryNavigation.isVisible())) {
    await page.getByRole('button', { name: /toggle navigation/i }).click();
  }

  await expect(primaryNavigation).toBeVisible();
  await page.getByLabel(/language/i).selectOption('ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});
