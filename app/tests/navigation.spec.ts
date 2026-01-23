import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('games nav link is active on homepage', async ({ page }) => {
    await page.goto('/');

    const gamesNav = page.locator('[data-testid="nav-games"]');
    await expect(gamesNav).toBeVisible();

    // Games link should have active styling (neon-cyan color class)
    await expect(gamesNav).toHaveClass(/text-neon-cyan/);
  });

  test('can navigate to leaderboard via bottom nav', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-testid="nav-leaderboard"]').click();
    await expect(page).toHaveURL('/leaderboard');
  });

  test('can navigate back to games from leaderboard', async ({ page }) => {
    await page.goto('/leaderboard');

    await page.locator('[data-testid="nav-games"]').click();
    await expect(page).toHaveURL('/');
  });

  test('leaderboard nav is active on leaderboard page', async ({ page }) => {
    await page.goto('/leaderboard');

    const leaderboardNav = page.locator('[data-testid="nav-leaderboard"]');
    await expect(leaderboardNav).toHaveClass(/text-neon-cyan/);
  });

  test('header logo navigates to home', async ({ page }) => {
    await page.goto('/leaderboard');

    const homeLink = page.locator('[data-testid="home-link"]');
    await expect(homeLink).toBeVisible();

    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('navigation persists across page loads', async ({ page }) => {
    await page.goto('/');

    // Navigate to leaderboard
    await page.locator('[data-testid="nav-leaderboard"]').click();
    await expect(page).toHaveURL('/leaderboard');

    // Reload page
    await page.reload();

    // Should still be on leaderboard
    await expect(page).toHaveURL('/leaderboard');
    await expect(page.locator('[data-testid="nav-leaderboard"]')).toHaveClass(/text-neon-cyan/);
  });
});
