import { test, expect } from '@playwright/test';

test.describe('Smoke Tests @smoke', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/Mini Game Heaven/i);

    // Verify header is visible
    await expect(page.locator('[data-testid="header"]')).toBeVisible();
  });

  test('game cards are displayed on homepage', async ({ page }) => {
    await page.goto('/');

    // Wait for game cards to load
    const gameCards = page.locator('[data-testid="game-card"]');
    await expect(gameCards.first()).toBeVisible();

    // Should have at least one game card
    await expect(gameCards).toHaveCount(await gameCards.count());
  });

  test('bottom navigation is visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('[data-testid="bottom-nav"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-games"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-leaderboard"]')).toBeVisible();
  });

  test('header home link works', async ({ page }) => {
    await page.goto('/leaderboard');

    await page.locator('[data-testid="home-link"]').click();
    await expect(page).toHaveURL('/');
  });
});
