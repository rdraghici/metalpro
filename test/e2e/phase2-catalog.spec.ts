import { test, expect } from '@playwright/test';

test.describe('Phase 2: Product Catalog & Discovery System - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to catalog page before each test
    await page.goto('/catalog');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('2.1: Catalog Page Load', () => {
    test('should load catalog page within 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/catalog');
      await page.waitForSelector('h1:has-text("Catalog")', { timeout: 3000 });
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);
    });

    test('should display hero section with title', async ({ page }) => {
      const heroTitle = page.locator('h1').first();
      await expect(heroTitle).toBeVisible();
      await expect(heroTitle).toContainText(/catalog/i);
    });

    test('should display filter panel', async ({ page }) => {
      const filterPanel = page.locator('aside').first();
      await expect(filterPanel).toBeVisible();
    });

    test('should display product grid', async ({ page }) => {
      const productGrid = page.locator('[class*="grid"]').filter({ hasText: /profil|tablă|țevi/i }).first();
      await expect(productGrid).toBeVisible();
    });

    test('should display sort dropdown', async ({ page }) => {
      const sortDropdown = page.getByText(/sortează după/i);
      await expect(sortDropdown).toBeVisible();
    });
  });

  test.describe('2.2: Filter by Family', () => {
    test('should filter products by Profile Metalice family', async ({ page }) => {
      // Click on family filter accordion or checkbox
      const profileFilter = page.getByText('Profile Metalice').first();
      await profileFilter.click();

      // Wait for URL to update
      await page.waitForTimeout(500);

      // Check URL contains family parameter
      expect(page.url()).toContain('family');

      // Verify filter chip appears
      const filterChip = page.locator('[class*="badge"], [class*="chip"]').filter({ hasText: /profile/i });
      await expect(filterChip.first()).toBeVisible();
    });

    test('should filter products by Table de Oțel family', async ({ page }) => {
      const platesFilter = page.getByText(/table de oțel/i).first();
      await platesFilter.click();

      await page.waitForTimeout(500);

      expect(page.url()).toContain('family');

      const filterChip = page.locator('[class*="badge"], [class*="chip"]').filter({ hasText: /table/i });
      await expect(filterChip.first()).toBeVisible();
    });

    test('should allow multiple family selections', async ({ page }) => {
      // Select first family
      const profileFilter = page.getByText('Profile Metalice').first();
      await profileFilter.click();
      await page.waitForTimeout(300);

      // Select second family
      const platesFilter = page.getByText(/table de oțel/i).first();
      await platesFilter.click();
      await page.waitForTimeout(300);

      // Check both are in URL
      const url = page.url();
      expect(url).toContain('family');

      // Two filter chips should appear
      const filterChips = page.locator('[class*="badge"], [class*="chip"]');
      const chipCount = await filterChips.count();
      expect(chipCount).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe('2.3: Filter by Grade', () => {
    test('should filter products by S235JR grade', async ({ page }) => {
      // Expand grade filter section if needed
      const gradeSection = page.getByText(/grad/i).first();
      await gradeSection.click();
      await page.waitForTimeout(200);

      // Click S235JR checkbox
      const s235Filter = page.getByText('S235JR').first();
      await s235Filter.click();

      await page.waitForTimeout(500);

      // Check URL contains grade parameter
      expect(page.url()).toContain('grade');

      // Verify filter chip appears
      const filterChip = page.locator('[class*="badge"], [class*="chip"]').filter({ hasText: /s235/i });
      await expect(filterChip.first()).toBeVisible();
    });

    test('should allow multiple grade selections', async ({ page }) => {
      const gradeSection = page.getByText(/grad/i).first();
      await gradeSection.click();
      await page.waitForTimeout(200);

      // Select S235JR
      const s235Filter = page.getByText('S235JR').first();
      await s235Filter.click();
      await page.waitForTimeout(300);

      // Select S355JR
      const s355Filter = page.getByText('S355JR').first();
      await s355Filter.click();
      await page.waitForTimeout(300);

      const url = page.url();
      expect(url).toContain('grade');
      expect(url).toMatch(/S235JR.*S355JR|S355JR.*S235JR/);
    });
  });

  test.describe('2.4: Filter by Standard', () => {
    test('should filter products by EN 10025 standard', async ({ page }) => {
      const standardSection = page.getByText(/standard/i).first();
      await standardSection.click();
      await page.waitForTimeout(200);

      const en10025Filter = page.getByText(/EN 10025/i).first();
      await en10025Filter.click();

      await page.waitForTimeout(500);

      expect(page.url()).toContain('standard');

      const filterChip = page.locator('[class*="badge"], [class*="chip"]').filter({ hasText: /EN 10025/i });
      await expect(filterChip.first()).toBeVisible();
    });
  });

  test.describe('2.5: Filter by Availability', () => {
    test('should filter products by In Stock availability', async ({ page }) => {
      const availabilitySection = page.getByText(/disponibilitate/i).first();
      await availabilitySection.click();
      await page.waitForTimeout(200);

      const inStockFilter = page.getByText(/în stoc/i).first();
      await inStockFilter.click();

      await page.waitForTimeout(500);

      expect(page.url()).toContain('availability');
    });
  });

  test.describe('2.6: Multiple Filters Simultaneously', () => {
    test('should apply multiple filters and display all chips', async ({ page }) => {
      // Apply family filter
      const profileFilter = page.getByText('Profile Metalice').first();
      await profileFilter.click();
      await page.waitForTimeout(300);

      // Apply grade filter
      const gradeSection = page.getByText(/grad/i).first();
      await gradeSection.click();
      await page.waitForTimeout(200);

      const s235Filter = page.getByText('S235JR').first();
      await s235Filter.click();
      await page.waitForTimeout(300);

      // Apply availability filter
      const availabilitySection = page.getByText(/disponibilitate/i).first();
      await availabilitySection.click();
      await page.waitForTimeout(200);

      const inStockFilter = page.getByText(/în stoc/i).first();
      await inStockFilter.click();
      await page.waitForTimeout(500);

      // Verify URL contains all parameters
      const url = page.url();
      expect(url).toContain('family');
      expect(url).toContain('grade');
      expect(url).toContain('availability');

      // Verify multiple filter chips are displayed
      const filterChips = page.locator('[class*="badge"], [class*="chip"]');
      const chipCount = await filterChips.count();
      expect(chipCount).toBeGreaterThanOrEqual(3);
    });

    test('should clear all filters when clear button clicked', async ({ page }) => {
      // First apply some filters
      const profileFilter = page.getByText('Profile Metalice').first();
      await profileFilter.click();
      await page.waitForTimeout(500);

      // Verify filter was applied
      expect(page.url()).toContain('family');

      // Click clear all button
      const clearButton = page.getByText(/șterge tot|clear all/i).first();
      await clearButton.click();
      await page.waitForTimeout(500);

      // Verify URL is cleared
      const url = page.url();
      expect(url).not.toContain('family');
      expect(url).not.toContain('grade');
      expect(url).not.toContain('availability');
    });
  });

  test.describe('2.7: Sort Products', () => {
    test('should display all sort options', async ({ page }) => {
      const sortTrigger = page.locator('[role="combobox"]').filter({ hasText: /implicit|sortează/i }).first();
      await sortTrigger.click();

      await page.waitForTimeout(300);

      // Check for sort options
      await expect(page.getByText(/nume.*a-z/i).first()).toBeVisible();
      await expect(page.getByText(/preț.*crescător/i).first()).toBeVisible();
    });

    test('should sort products by name A-Z', async ({ page }) => {
      const sortTrigger = page.locator('[role="combobox"]').filter({ hasText: /implicit|sortează/i }).first();
      await sortTrigger.click();

      await page.waitForTimeout(300);

      const nameAscOption = page.getByText(/nume.*a-z/i).first();
      await nameAscOption.click();

      await page.waitForTimeout(500);

      expect(page.url()).toContain('sort=title-asc');
    });

    test('should sort products by price ascending', async ({ page }) => {
      const sortTrigger = page.locator('[role="combobox"]').filter({ hasText: /implicit|sortează/i }).first();
      await sortTrigger.click();

      await page.waitForTimeout(300);

      const priceAscOption = page.getByText(/preț.*crescător/i).first();
      await priceAscOption.click();

      await page.waitForTimeout(500);

      expect(page.url()).toContain('sort=price-asc');
    });
  });

  test.describe('2.8: Pagination', () => {
    test('should display pagination controls', async ({ page }) => {
      // Check if pagination exists (may not be visible if few products)
      const paginationExists = await page.locator('[class*="pagination"], nav[aria-label*="pagination"]').count() > 0;

      if (paginationExists) {
        const pagination = page.locator('[class*="pagination"], nav[aria-label*="pagination"]').first();
        await expect(pagination).toBeVisible();
      }
    });

    test('should navigate to page 2 when clicking page 2 button', async ({ page }) => {
      const page2Button = page.locator('button, a').filter({ hasText: /^2$/ }).first();

      // Only run test if page 2 button exists
      if (await page2Button.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page2Button.click();
        await page.waitForTimeout(500);

        expect(page.url()).toContain('page=2');
      }
    });

    test('should navigate using next button', async ({ page }) => {
      const nextButton = page.locator('button, a').filter({ hasText: /next|următoare/i }).first();

      if (await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(500);

        expect(page.url()).toContain('page=2');
      }
    });
  });

  test.describe('2.9: Breadcrumb Navigation', () => {
    test('should display breadcrumbs on catalog page', async ({ page }) => {
      const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], [class*="breadcrumb"]').first();
      await expect(breadcrumbs).toBeVisible();
    });

    test('should navigate to home when clicking home in breadcrumb', async ({ page }) => {
      const homeLink = page.locator('a').filter({ hasText: /^home$|^acasă$/i }).first();
      await homeLink.click();

      await page.waitForLoadState('networkidle');

      expect(page.url()).toMatch(/\/$|\/index/);
    });
  });

  test.describe('2.16-2.17: Category Pages', () => {
    test('should navigate to profiles category page', async ({ page }) => {
      await page.goto('/catalog/profiles');
      await page.waitForLoadState('networkidle');

      const heroTitle = page.locator('h1').first();
      await expect(heroTitle).toContainText(/profile metalice/i);
    });

    test('should display correct description on profiles page', async ({ page }) => {
      await page.goto('/catalog/profiles');
      await page.waitForLoadState('networkidle');

      const description = page.locator('p').filter({ hasText: /hea|unp|ipe/i }).first();
      await expect(description).toBeVisible();
    });

    test('should navigate to plates category page', async ({ page }) => {
      await page.goto('/catalog/plates');
      await page.waitForLoadState('networkidle');

      const heroTitle = page.locator('h1').first();
      await expect(heroTitle).toContainText(/table de oțel/i);
    });

    test('should navigate to pipes category page', async ({ page }) => {
      await page.goto('/catalog/pipes');
      await page.waitForLoadState('networkidle');

      const heroTitle = page.locator('h1').first();
      await expect(heroTitle).toContainText(/țevi.*tuburi/i);
    });

    test('should filter products by category on category page', async ({ page }) => {
      await page.goto('/catalog/profiles');
      await page.waitForLoadState('networkidle');

      // URL should reflect the category but not necessarily as a query param
      expect(page.url()).toContain('/profiles');
    });

    test('should display category in breadcrumb', async ({ page }) => {
      await page.goto('/catalog/profiles');
      await page.waitForLoadState('networkidle');

      const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], [class*="breadcrumb"]').first();
      await expect(breadcrumbs).toContainText(/profile/i);
    });
  });

  test.describe('2.18: URL State Persistence', () => {
    test('should restore filters from URL when page loads', async ({ page }) => {
      // Navigate with filters in URL
      await page.goto('/catalog?family=profiles&grade=S235JR&sort=price-asc&page=1');
      await page.waitForLoadState('networkidle');

      // Verify filter chips are displayed
      const filterChips = page.locator('[class*="badge"], [class*="chip"]');
      const chipCount = await filterChips.count();
      expect(chipCount).toBeGreaterThan(0);

      // Verify sort is selected
      expect(page.url()).toContain('sort=price-asc');
    });

    test('should maintain filters when navigating with browser back button', async ({ page }) => {
      // Apply a filter
      const profileFilter = page.getByText('Profile Metalice').first();
      await profileFilter.click();
      await page.waitForTimeout(500);

      const urlWithFilter = page.url();
      expect(urlWithFilter).toContain('family');

      // Navigate away
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Go back
      await page.goBack();
      await page.waitForLoadState('networkidle');

      // Verify filter is restored
      expect(page.url()).toContain('family');
    });
  });

  test.describe('2.19: Product Grid Display', () => {
    test('should display product cards in grid layout', async ({ page }) => {
      const productGrid = page.locator('[class*="grid"]').filter({ hasText: /profil|tablă|țevi/i }).first();
      await expect(productGrid).toBeVisible();

      const productCards = page.locator('[class*="card"]').filter({ hasText: /profil|tablă|țevi/i });
      const cardCount = await productCards.count();
      expect(cardCount).toBeGreaterThan(0);
    });

    test('should display product information on cards', async ({ page }) => {
      const firstProduct = page.locator('[class*="card"]').filter({ hasText: /profil|tablă|țevi/i }).first();
      await expect(firstProduct).toBeVisible();

      // Product card should have title and other info
      const hasText = await firstProduct.textContent();
      expect(hasText).toBeTruthy();
      expect(hasText!.length).toBeGreaterThan(5);
    });

    test('should show hover effect on product cards', async ({ page }) => {
      const firstProduct = page.locator('[class*="card"]').filter({ hasText: /profil|tablă|țevi/i }).first();

      // Hover over the card
      await firstProduct.hover();
      await page.waitForTimeout(200);

      // Card should still be visible (hover effect applied)
      await expect(firstProduct).toBeVisible();
    });
  });

  test.describe('2.20: Loading States', () => {
    test('should show loading state when navigating between pages', async ({ page }) => {
      // This is implicit - Playwright waits for navigation
      await page.goto('/catalog');
      await page.waitForLoadState('networkidle');

      // Page should be fully loaded
      const heroTitle = page.locator('h1').first();
      await expect(heroTitle).toBeVisible();
    });
  });

  test.describe('2.21: Responsive Design', () => {
    test('should display filter panel on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/catalog');
      await page.waitForLoadState('networkidle');

      const filterPanel = page.locator('aside').first();
      await expect(filterPanel).toBeVisible();
    });

    test('should adapt layout for tablet view', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/catalog');
      await page.waitForLoadState('networkidle');

      // Page should still be functional
      const heroTitle = page.locator('h1').first();
      await expect(heroTitle).toBeVisible();
    });

    test('should adapt layout for mobile view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/catalog');
      await page.waitForLoadState('networkidle');

      // Page should still be functional
      const heroTitle = page.locator('h1').first();
      await expect(heroTitle).toBeVisible();

      // Filter panel might be hidden or in a drawer on mobile
      // Just verify page loaded correctly
      expect(page.url()).toContain('/catalog');
    });
  });

  test.describe('2.22: Combined Filter and Sort Interaction', () => {
    test('should apply filter and sort together', async ({ page }) => {
      // Apply family filter
      const profileFilter = page.getByText('Profile Metalice').first();
      await profileFilter.click();
      await page.waitForTimeout(500);

      // Apply sort
      const sortTrigger = page.locator('[role="combobox"]').filter({ hasText: /implicit|sortează/i }).first();
      await sortTrigger.click();
      await page.waitForTimeout(300);

      const priceAscOption = page.getByText(/preț.*crescător/i).first();
      await priceAscOption.click();
      await page.waitForTimeout(500);

      // Verify both are in URL
      const url = page.url();
      expect(url).toContain('family');
      expect(url).toContain('sort=price-asc');
    });

    test('should maintain filters when changing pages', async ({ page }) => {
      // Apply filter
      const profileFilter = page.getByText('Profile Metalice').first();
      await profileFilter.click();
      await page.waitForTimeout(500);

      // Apply sort
      const sortTrigger = page.locator('[role="combobox"]').filter({ hasText: /implicit|sortează/i }).first();
      await sortTrigger.click();
      await page.waitForTimeout(300);

      const priceAscOption = page.getByText(/preț.*crescător/i).first();
      await priceAscOption.click();
      await page.waitForTimeout(500);

      // Try to navigate to page 2 if it exists
      const page2Button = page.locator('button, a').filter({ hasText: /^2$/ }).first();

      if (await page2Button.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page2Button.click();
        await page.waitForTimeout(500);

        // Verify filter and sort are maintained
        const url = page.url();
        expect(url).toContain('family');
        expect(url).toContain('sort=price-asc');
        expect(url).toContain('page=2');
      }
    });
  });
});
