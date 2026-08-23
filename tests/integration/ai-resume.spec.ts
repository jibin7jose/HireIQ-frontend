import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('AI Resume Parsing Flow', () => {
  test.setTimeout(120000);

  test('should upload resume', async ({ page }) => {
    const candidateEmail = `ai_tester_${Date.now()}@gmail.com`;
    const candidatePassword = 'Password123!';

    await page.goto('/auth/register');
    await page.fill('input[name="fullName"]', 'AI Resume Tester');
    await page.fill('input[name="email"]', candidateEmail);
    await page.fill('input[name="phone"]', '1111111111');
    await page.fill('input[name="password"]', candidatePassword);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForURL(/\/auth\/login/);

    await page.fill('input[type="email"]', candidateEmail);
    await page.fill('input[type="password"]', candidatePassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/candidate\/dashboard/);

    await page.goto('/candidate/profile');
    
    const resumePath = path.resolve(__dirname, '../../../Jibin_Jose_Resume_ATS.pdf');
    await page.setInputFiles('input[type="file"]', resumePath);

    await page.waitForTimeout(15000);
  });
});
