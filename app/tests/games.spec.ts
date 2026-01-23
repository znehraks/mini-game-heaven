import { test, expect } from '@playwright/test';

test.describe('Games', () => {
  test.describe('Gravity Switcher', () => {
    test('loads the game page', async ({ page }) => {
      await page.goto('/games/gravity-switcher');

      // Should have the game canvas
      await expect(page.locator('canvas')).toBeVisible();
    });

    test('header is visible on game page', async ({ page }) => {
      await page.goto('/games/gravity-switcher');

      // Header should be present
      await expect(page.locator('[data-testid="header"]')).toBeVisible();
    });

    test('can navigate home via header logo', async ({ page }) => {
      await page.goto('/games/gravity-switcher');

      await page.locator('[data-testid="home-link"]').click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Color Rush', () => {
    test('loads the game page', async ({ page }) => {
      await page.goto('/games/color-rush');

      // Should have the game canvas
      await expect(page.locator('canvas')).toBeVisible();
    });

    test('header is visible on game page', async ({ page }) => {
      await page.goto('/games/color-rush');

      // Header should be present
      await expect(page.locator('[data-testid="header"]')).toBeVisible();
    });

    test('can navigate home via header logo', async ({ page }) => {
      await page.goto('/games/color-rush');

      await page.locator('[data-testid="home-link"]').click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Neon Tower', () => {
    test('loads the game page', async ({ page }) => {
      await page.goto('/games/neon-tower');

      // Should have the game canvas
      await expect(page.locator('canvas')).toBeVisible();
    });
  });
});
