import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('login page should render properly', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check if the title or a specific element is present
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show error for non-gmail address', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'test@yahoo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text=Please use a valid Gmail address (@gmail.com).')).toBeVisible();
  });

  test('should show error for short password', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'test@gmail.com');
    await page.fill('input[type="password"]', '12345');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text=Password must be at least 6 characters long.')).toBeVisible();
  });

  test('should register a new user and then log in', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes timeout for slow local backend
    // Generate a unique email to avoid "User already exists" errors
    const uniqueEmail = `testuser${Date.now()}@gmail.com`;
    const password = 'Password123!';

    // 1. Go to Register Page
    await page.goto('/auth/register');
    
    // 2. Fill out registration form
    await page.fill('input[name="fullName"]', 'Integration Test User');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="password"]', password);
    
    // 3. Submit Registration
    await page.getByRole('button', { name: 'Create Account' }).click();

    // 4. Verify it redirects to login
    await page.waitForURL(/\/auth\/login/);

    // 5. Fill out the login form with the newly created credentials
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', password);
    
    // 6. Submit Login
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 7. Verify successful login (Should redirect to candidate dashboard since Candidate is default role)
    await page.waitForURL(/\/candidate\/dashboard/);
    
    // Check if some dashboard specific element is there (e.g. url match is enough for now)
    expect(page.url()).toContain('/candidate/dashboard');
  });
});
