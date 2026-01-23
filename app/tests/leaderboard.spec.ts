import { test, expect } from '@playwright/test';

test.describe('Leaderboard', () => {
  test('leaderboard page loads correctly', async ({ page }) => {
    await page.goto('/leaderboard');

    // Should have leaderboard title (use role selector for h1)
    await expect(page.getByRole('heading', { name: 'LEADERBOARD' })).toBeVisible();
  });

  test('shows all games filter tab', async ({ page }) => {
    await page.goto('/leaderboard');

    await expect(page.locator('[data-testid="filter-all"]')).toBeVisible();
  });

  test('shows individual game filter tabs', async ({ page }) => {
    await page.goto('/leaderboard');

    // Should have filter tabs for each game
    await expect(page.locator('[data-testid="filter-neon-tower"]')).toBeVisible();
    await expect(page.locator('[data-testid="filter-gravity-switcher"]')).toBeVisible();
    await expect(page.locator('[data-testid="filter-color-rush"]')).toBeVisible();
  });

  test('can filter by specific game', async ({ page }) => {
    await page.goto('/leaderboard');

    // Click on Neon Tower filter
    await page.locator('[data-testid="filter-neon-tower"]').click();

    // Should show the game title (use role heading for h2)
    await expect(page.getByRole('heading', { name: 'NEON TOWER STACK' })).toBeVisible();
  });

  test('shows live indicator', async ({ page }) => {
    await page.goto('/leaderboard');

    // Should show realtime indicator
    await expect(page.getByText('LIVE')).toBeVisible();
  });

  test('can navigate via bottom nav', async ({ page }) => {
    await page.goto('/');

    // Click on leaderboard in bottom nav
    await page.locator('[data-testid="nav-leaderboard"]').click();

    await expect(page).toHaveURL('/leaderboard');
  });
});
