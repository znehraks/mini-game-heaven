import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login');

    // Should have login options
    await expect(page.getByText('SIGN IN WITH DISCORD')).toBeVisible();
    await expect(page.getByText('PLAY AS GUEST')).toBeVisible();
  });

  test('shows branding on login page', async ({ page }) => {
    await page.goto('/login');

    // Use role selector to get the specific heading
    await expect(page.getByRole('heading', { name: 'MINI GAME' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'HEAVEN' })).toBeVisible();
  });

  test('guest login redirects to home', async ({ page }) => {
    await page.goto('/login');

    await page.getByText('PLAY AS GUEST').click();

    // Should redirect to home
    await expect(page).toHaveURL('/');
  });

  test('can navigate back to games from login', async ({ page }) => {
    await page.goto('/login');

    await page.getByText('← BACK TO GAMES').click();

    await expect(page).toHaveURL('/');
  });

  test('discord login button is clickable', async ({ page }) => {
    await page.goto('/login');

    const discordButton = page.getByText('SIGN IN WITH DISCORD');
    await expect(discordButton).toBeEnabled();
  });
});
