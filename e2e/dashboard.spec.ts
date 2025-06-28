import { test, expect } from '@playwright/test';

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.fill('input[type="email"]', 'admin@subify.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
  });

  test('should display admin dashboard with stats', async ({ page }) => {
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Monthly Recurring Revenue')).toBeVisible();
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Active Subscriptions')).toBeVisible();
  });

  test('should navigate between dashboard tabs', async ({ page }) => {
    // Click on Users tab
    await page.click('text=Users');
    await expect(page.locator('text=User Management')).toBeVisible();
    
    // Click on Products tab
    await page.click('text=Products');
    await expect(page.locator('text=Product Management')).toBeVisible();
    
    // Click on Purchases tab
    await page.click('text=Purchases');
    await expect(page.locator('text=Purchase History')).toBeVisible();
    
    // Back to Overview
    await page.click('text=Overview');
    await expect(page.locator('text=Revenue Over Time')).toBeVisible();
  });

  test('should search and filter users', async ({ page }) => {
    // Navigate to Users tab
    await page.click('text=Users');
    
    // Search for a user
    await page.fill('input[placeholder="Search users..."]', 'John');
    
    // Should show filtered results
    await expect(page.locator('text=John Creator')).toBeVisible();
    
    // Clear search
    await page.fill('input[placeholder="Search users..."]', '');
    
    // Filter by status
    await page.selectOption('select', 'active');
    
    // Should show only active users
    await expect(page.locator('text=Active')).toBeVisible();
  });

  test('should approve pending products', async ({ page }) => {
    // Navigate to Products tab
    await page.click('text=Products');
    
    // Check if there are pending products
    const pendingSection = page.locator('text=Pending Approvals');
    if (await pendingSection.isVisible()) {
      // Click approve on first pending product
      await page.click('button:has-text("Approve")').first();
      
      // Should show success message
      await expect(page.locator('text=Product approved successfully')).toBeVisible();
    }
  });
});