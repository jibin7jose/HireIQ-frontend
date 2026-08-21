import { test, expect } from '@playwright/test';

test.describe('Job Pipeline Flow', () => {
  test.setTimeout(120000); // 2 minutes timeout for full flow

  test('should allow an employer to create a job and a candidate to apply', async ({ browser }) => {
    // We use two separate browser contexts to simulate two different users concurrently
    const employerContext = await browser.newContext();
    const employerPage = await employerContext.newPage();

    const candidateContext = await browser.newContext();
    const candidatePage = await candidateContext.newPage();

    // ---------------------------------------------------------
    // STEP 1: Employer Registration
    // ---------------------------------------------------------
    const employerEmail = `employer${Date.now()}@gmail.com`;
    const employerPassword = 'Password123!';
    const uniqueJobTitle = `E2E Integration Test Job ${Date.now()}`;

    await employerPage.goto('/auth/register');
    await employerPage.fill('input[name="fullName"]', 'TechCorp Inc');
    await employerPage.fill('input[name="email"]', employerEmail);
    await employerPage.fill('input[name="phone"]', '1234567890');
    await employerPage.fill('input[name="password"]', employerPassword);
    
    // Select Employer Role
    await employerPage.getByText('Employer', { exact: true }).click();
    
    await employerPage.getByRole('button', { name: 'Create Account' }).click();
    await employerPage.waitForURL(/\/auth\/login/);

    // Employer Login
    await employerPage.fill('input[type="email"]', employerEmail);
    await employerPage.fill('input[type="password"]', employerPassword);
    await employerPage.getByRole('button', { name: 'Sign In' }).click();
    await employerPage.waitForURL(/\/employer\/dashboard/);

    // ---------------------------------------------------------
    // STEP 2: Job Creation
    // ---------------------------------------------------------
    await employerPage.goto('/employer/jobs/new');
    
    // Fill title
    await employerPage.locator('input[name="title"]').fill(uniqueJobTitle);
    await employerPage.waitForTimeout(100); // Allow React to re-render
    
    // Select job type
    await employerPage.locator('select[name="jobType"]').selectOption('Full-Time');
    await employerPage.waitForTimeout(100);
    
    await employerPage.locator('input[name="location"]').fill('Remote');
    await employerPage.locator('input[name="minSalary"]').fill('90000');
    await employerPage.locator('input[name="maxSalary"]').fill('150000');
    await employerPage.locator('textarea[name="description"]').fill('This is a test job description for E2E testing that meets the 50 character minimum requirement.');
    
    await employerPage.getByRole('button', { name: 'Post Job' }).click();
    await employerPage.waitForURL(/\/employer\/dashboard/);

    // ---------------------------------------------------------
    // STEP 3: Candidate Registration
    // ---------------------------------------------------------
    const candidateEmail = `candidate${Date.now()}@gmail.com`;
    const candidatePassword = 'Password123!';

    await candidatePage.goto('/auth/register');
    await candidatePage.fill('input[name="fullName"]', 'Jane Doe');
    await candidatePage.fill('input[name="email"]', candidateEmail);
    await candidatePage.fill('input[name="phone"]', '1987654321');
    await candidatePage.fill('input[name="password"]', candidatePassword);
    // Role is Candidate by default
    await candidatePage.getByRole('button', { name: 'Create Account' }).click();
    await candidatePage.waitForURL(/\/auth\/login/);

    // Candidate Login
    await candidatePage.fill('input[type="email"]', candidateEmail);
    await candidatePage.fill('input[type="password"]', candidatePassword);
    await candidatePage.getByRole('button', { name: 'Sign In' }).click();
    await candidatePage.waitForURL(/\/candidate\/dashboard/);

    // ---------------------------------------------------------
    // STEP 4: Candidate Searches for the Job and Applies
    // ---------------------------------------------------------
    await candidatePage.goto('/jobs');
    
    // Find the job in the list
    const jobLink = candidatePage.locator(`text=${uniqueJobTitle}`);
    await jobLink.click();

    // Verify we are on the job details page and apply
    await candidatePage.waitForURL(/\/jobs\/.+/);
    await candidatePage.getByRole('button', { name: 'Apply Now' }).click();
    
    // Verify application success (button changes to "Successfully Applied")
    await expect(candidatePage.locator('text=Successfully Applied')).toBeVisible();

    await employerContext.close();
    await candidateContext.close();
  });
});
