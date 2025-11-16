import { test, expect } from '@playwright/test';

test.describe('Phase 1: Core Infrastructure & Design System - E2E Tests', () => {
  test.describe('1.1: Home Page Load', () => {
    test('should load home page within 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000);
    });

    test('should display MetalPro logo in header', async ({ page }) => {
      await page.goto('/');

      // Check for logo (text "M" or "MetalPro")
      const logo = page.locator('header').getByText(/MetalPro/i).first();
      await expect(logo).toBeVisible();
    });

    test('should display contact ribbon with phone number', async ({ page }) => {
      await page.goto('/');

      // Check for phone number in contact ribbon
      const phoneLink = page.getByRole('link', { name: /\+40 xxx xxx xxx/i });
      await expect(phoneLink).toBeVisible();
      await expect(phoneLink).toHaveAttribute('href', 'tel:+40xxxxxxxxx');
    });

    test('should display hero section with heading', async ({ page }) => {
      await page.goto('/');

      // Check for hero heading
      const heading = page.getByRole('heading', {
        name: /Materiale Metalice pentru Proiecte B2B/i,
      }).first();
      await expect(heading).toBeVisible();
    });

    test('should display trust indicators', async ({ page }) => {
      await page.goto('/');

      // These might be in different elements, so we check for the text content
      await expect(page.getByText(/Estimare în timp real/i).first()).toBeVisible();
      await expect(page.getByText(/Support specialist/i).first()).toBeVisible();
      await expect(page.getByText(/Livrare rapidă/i).first()).toBeVisible();
    });

    test('should display two CTA buttons', async ({ page }) => {
      await page.goto('/');

      const catalogButton = page.getByRole('button', { name: /Vezi Catalogul/i }).first();
      const bomButton = page.getByRole('button', { name: /Încarcă Lista BOM/i }).first();

      await expect(catalogButton).toBeVisible();
      await expect(bomButton).toBeVisible();
    });

    test('should display statistics section', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByText(/500\+ Produse disponibile/i).first()).toBeVisible();
      await expect(page.getByText(/24h Timp răspuns ofertă/i).first()).toBeVisible();
      await expect(page.getByText(/1000\+ Proiecte realizate/i).first()).toBeVisible();
    });

    test('should display footer at bottom of page', async ({ page }) => {
      await page.goto('/');

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });
  });

  test.describe('1.2: Header Navigation Links', () => {
    test('should navigate to home page when logo is clicked', async ({ page }) => {
      await page.goto('/catalog');

      // Click logo to go back home
      const logo = page.locator('header').getByRole('link', { name: /MetalPro/i }).first();
      await logo.click();

      await expect(page).toHaveURL('/');
    });

    test('should have working phone link', async ({ page }) => {
      await page.goto('/');

      const phoneLink = page.getByRole('link', { name: /\+40 xxx xxx xxx/i });
      await expect(phoneLink).toHaveAttribute('href', 'tel:+40xxxxxxxxx');
    });

    test('should display business hours in contact ribbon', async ({ page }) => {
      await page.goto('/');

      const contactRibbon = page.locator('header').first();
      await expect(contactRibbon).toContainText(/L-V 08:00-16:30/i);
    });
  });

  test.describe('1.3: Responsive Design', () => {
    test('should adapt to mobile view (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Header should be visible
      const header = page.locator('header');
      await expect(header).toBeVisible();

      // Hero text should be readable
      const heroHeading = page.getByRole('heading', {
        name: /Materiale Metalice pentru Proiecte B2B/i,
      }).first();
      await expect(heroHeading).toBeVisible();

      // CTA buttons should be visible
      await expect(page.getByRole('button', { name: /Vezi Catalogul/i }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: /Încarcă Lista BOM/i }).first()).toBeVisible();
    });

    test('should adapt to tablet view (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      // All main sections should be visible
      const header = page.locator('header');
      await expect(header).toBeVisible();

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Interactive elements should be clickable
      const catalogButton = page.getByRole('button', { name: /Vezi Catalogul/i }).first();
      await expect(catalogButton).toBeVisible();
      await expect(catalogButton).toBeEnabled();
    });

    test('should adapt to desktop view (1280px)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');

      // Full header navigation should be visible
      const header = page.locator('header');
      await expect(header).toBeVisible();

      // All sections should be properly laid out
      await expect(page.getByRole('heading', {
        name: /Materiale Metalice pentru Proiecte B2B/i,
      }).first()).toBeVisible();

      // Footer should be visible
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should maintain functionality across viewport transitions', async ({ page }) => {
      await page.goto('/');

      // Start with desktop
      await page.setViewportSize({ width: 1280, height: 800 });
      let catalogButton = page.getByRole('button', { name: /Vezi Catalogul/i }).first();
      await expect(catalogButton).toBeVisible();

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });
      catalogButton = page.getByRole('button', { name: /Vezi Catalogul/i }).first();
      await expect(catalogButton).toBeVisible();

      // Back to desktop
      await page.setViewportSize({ width: 1280, height: 800 });
      catalogButton = page.getByRole('button', { name: /Vezi Catalogul/i }).first();
      await expect(catalogButton).toBeVisible();
    });
  });
});
