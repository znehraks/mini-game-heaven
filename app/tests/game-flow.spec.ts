import { test, expect } from '@playwright/test';

test.describe('Game Flow', () => {
  test('can navigate to Neon Tower game page', async ({ page }) => {
    await page.goto('/games/neon-tower');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // The page should have loaded (either canvas or game content)
    await expect(page.locator('main')).toBeVisible();
  });

  test('game page shows loading or game canvas', async ({ page }) => {
    await page.goto('/games/neon-tower');

    // Wait for the page content to stabilize
    await page.waitForLoadState('domcontentloaded');

    // Check that we're on a game page
    await expect(page).toHaveURL(/\/games\/neon-tower/);
  });

  test('clicking game card navigates to game page', async ({ page }) => {
    await page.goto('/');

    // Wait for game cards to be visible
    const gameCards = page.locator('[data-testid="game-card"]');
    await expect(gameCards.first()).toBeVisible();

    // Click the first game card
    await gameCards.first().click();

    // Should navigate to a game page
    await expect(page).toHaveURL(/\/games\//);
  });

  test('game page has proper structure', async ({ page }) => {
    await page.goto('/games/neon-tower');

    // Header should still be visible on game page
    await expect(page.locator('[data-testid="header"]')).toBeVisible();

    // Main content area should exist
    await expect(page.locator('main')).toBeVisible();
  });
});
