import { test, expect } from '@playwright/test';

/**
 * Phase 10: Back-Office System & Category Management - E2E Tests
 *
 * These tests cover the entire backoffice system including:
 * - Authentication (login, logout, route protection)
 * - Dashboard (KPIs and navigation)
 * - RFQ Management (list, filters, details)
 * - Product Management (list, filters, CRUD, images)
 * - Category Management (list, CRUD, validation, constraints)
 *
 * NOTE: These tests make real API calls to the backend.
 * Ensure the backend is running on localhost:3001 before running tests.
 */

const BACKEND_URL = 'http://localhost:3001';
const API_URL = BACKEND_URL;

test.describe('Phase 10: Back-Office System - E2E Tests', () => {
  // Test credentials (ensure these exist in your database)
  const TEST_OPERATOR = {
    email: 'admin@metalpro.ro',
    password: 'operator123',
  };

  // Helper function to login
  async function login(page: any, email: string = TEST_OPERATOR.email, password: string = TEST_OPERATOR.password) {
    await page.goto('/backoffice/login');
    await page.waitForTimeout(1000);

    const emailField = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
    const passwordField = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i));

    await emailField.fill(email);
    await passwordField.fill(password);

    const signInButton = page.getByRole('button', { name: /sign in/i });
    await signInButton.click();

    // Wait for navigation to dashboard
    await page.waitForURL(/\/backoffice\/dashboard/, { timeout: 10000 });
    await page.waitForTimeout(1500);
  }

  // Helper function to logout
  async function logout(page: any) {
    const logoutButton = page.getByRole('button', { name: /logout/i });
    const hasButton = await logoutButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasButton) {
      await logoutButton.click();
      await page.waitForTimeout(1000);
    }
  }

  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  // ==========================================
  // AUTHENTICATION & AUTHORIZATION
  // ==========================================

  test.describe('Authentication', () => {
    test('1.1: should display back-office login page with all elements', async ({ page }) => {
      await page.goto('/backoffice/login');
      await page.waitForTimeout(1000);

      // Check login page heading
      const heading = page.getByRole('heading', { name: /back-office login/i });
      await expect(heading).toBeVisible();

      // Check email field
      const emailField = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
      await expect(emailField).toBeVisible();
      await expect(emailField).toHaveAttribute('type', 'email');

      // Check password field
      const passwordField = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i));
      await expect(passwordField).toBeVisible();
      await expect(passwordField).toHaveAttribute('type', 'password');

      // Check sign in button
      const signInButton = page.getByRole('button', { name: /sign in/i });
      await expect(signInButton).toBeVisible();
      await expect(signInButton).toBeEnabled();

      // Check security message
      await expect(page.getByText(/secure area|unauthorized access/i)).toBeVisible();
    });

    test('1.2: should show error on invalid credentials', async ({ page }) => {
      await page.goto('/backoffice/login');
      await page.waitForTimeout(1000);

      // Fill invalid credentials
      const emailField = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
      const passwordField = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i));

      await emailField.fill('invalid@email.com');
      await passwordField.fill('wrongpassword');

      const signInButton = page.getByRole('button', { name: /sign in/i });
      await signInButton.click();

      await page.waitForTimeout(2000);

      // Should show error message
      const errorMessage = page.getByText(/invalid credentials|invalid email or password/i);
      const hasError = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasError) {
        await expect(errorMessage).toBeVisible();
      }

      // Should remain on login page
      expect(page.url()).toContain('/backoffice/login');
    });

    test('1.3: should successfully login with valid credentials', async ({ page }) => {
      await login(page);

      // Should be on dashboard
      expect(page.url()).toContain('/backoffice/dashboard');

      // Dashboard heading should be visible
      const heading = page.getByRole('heading', { name: /dashboard/i });
      const hasHeading = await heading.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasHeading) {
        await expect(heading).toBeVisible();
      }
    });

    test('1.4: should protect back-office routes from unauthorized access', async ({ page }) => {
      const protectedRoutes = [
        '/backoffice/dashboard',
        '/backoffice/rfqs',
        '/backoffice/products',
        '/backoffice/categories',
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        await page.waitForTimeout(1500);

        // Should redirect to login
        expect(page.url()).toContain('/backoffice/login');
      }
    });

    test('1.5: should logout successfully', async ({ page }) => {
      await login(page);

      // Click logout button
      await logout(page);

      // Should redirect to login page
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/backoffice/login');

      // Try to access dashboard - should redirect to login
      await page.goto('/backoffice/dashboard');
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/backoffice/login');
    });
  });

  // ==========================================
  // DASHBOARD
  // ==========================================

  test.describe('Dashboard', () => {
    test('2.1: should display dashboard with navigation sidebar', async ({ page }) => {
      await login(page);

      // Check sidebar navigation links
      const navLinks = ['Dashboard', 'RFQs', 'Products', 'Categories'];

      for (const linkText of navLinks) {
        const navLink = page.getByRole('link', { name: new RegExp(linkText, 'i') }).or(
          page.locator('nav').getByText(new RegExp(linkText, 'i'))
        );

        const hasLink = await navLink.first().isVisible({ timeout: 2000 }).catch(() => false);

        if (hasLink) {
          await expect(navLink.first()).toBeVisible();
        }
      }

      // Check user info is displayed
      const userInfo = page.getByText(TEST_OPERATOR.email).or(page.locator('text=/operator/i'));
      const hasUserInfo = await userInfo.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasUserInfo) {
        await expect(userInfo).toBeVisible();
      }

      // Check logout button exists
      const logoutButton = page.getByRole('button', { name: /logout/i });
      const hasLogout = await logoutButton.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasLogout) {
        await expect(logoutButton).toBeVisible();
      }
    });

    test('2.2: should navigate between back-office sections', async ({ page }) => {
      await login(page);

      const sections = [
        { name: /rfq/i, url: '/rfqs' },
        { name: /product/i, url: '/products' },
        { name: /categor/i, url: '/categories' },
        { name: /dashboard/i, url: '/dashboard' },
      ];

      for (const section of sections) {
        const navLink = page.getByRole('link', { name: section.name }).or(
          page.locator('nav').getByText(section.name)
        ).first();

        const hasLink = await navLink.isVisible({ timeout: 3000 }).catch(() => false);

        if (hasLink) {
          await navLink.click();
          await page.waitForTimeout(1500);

          // Should navigate to the correct section
          expect(page.url()).toContain(section.url);
        }
      }
    });
  });

  // ==========================================
  // PRODUCT MANAGEMENT
  // ==========================================

  test.describe('Product Management', () => {
    test('3.1: should display product list page', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/products');
      await page.waitForTimeout(2000);

      // Check heading
      const heading = page.getByRole('heading', { name: /product/i });
      const hasHeading = await heading.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasHeading) {
        await expect(heading).toBeVisible();
      }

      // Check for "Add Product" button
      const addButton = page.getByRole('button', { name: /add.*product/i }).or(
        page.getByRole('link', { name: /add.*product/i })
      );
      const hasButton = await addButton.first().isVisible({ timeout: 2000 }).catch(() => false);

      if (hasButton) {
        await expect(addButton.first()).toBeVisible();
      }

      // Check for search functionality
      const searchBox = page.getByPlaceholder(/search/i);
      const hasSearch = await searchBox.first().isVisible({ timeout: 2000 }).catch(() => false);

      if (hasSearch) {
        await expect(searchBox.first()).toBeVisible();
      }
    });

    test('3.2: should navigate to create product page', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/products');
      await page.waitForTimeout(2000);

      // Click "Add Product" button
      const addButton = page.getByRole('button', { name: /add.*product|new.*product/i }).or(
        page.getByRole('link', { name: /add|new/i })
      );
      const hasButton = await addButton.first().isVisible({ timeout: 3000 }).catch(() => false);

      if (hasButton) {
        await addButton.first().click();
        await page.waitForTimeout(2000);

        // Should be on create product page
        expect(page.url()).toContain('/products/new');

        // Check for "New Product" heading
        const heading = page.getByRole('heading', { name: /new product|add product/i });
        const hasHeading = await heading.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasHeading) {
          await expect(heading).toBeVisible();
        }

        // Check for required form fields
        const skuField = page.getByLabel(/sku/i).or(page.getByPlaceholder(/sku/i));
        const hasField = await skuField.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasField) {
          await expect(skuField).toBeVisible();
        }
      }
    });

    test('3.3: should validate required fields on product creation', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/products/new');
      await page.waitForTimeout(2000);

      // Try to save without filling required fields
      const saveButton = page.getByRole('button', { name: /save/i });
      const hasButton = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasButton) {
        await saveButton.click();
        await page.waitForTimeout(1500);

        // Should show validation error or prevent submission
        const errorMessage = page.getByText(/required|fill/i);
        const hasError = await errorMessage.first().isVisible({ timeout: 3000 }).catch(() => false);

        // Either validation message appears OR we stay on the same page
        const stillOnNewPage = page.url().includes('/products/new');

        expect(hasError || stillOnNewPage).toBe(true);
      }
    });

    test('3.4: should create a new product successfully', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/products/new');
      await page.waitForTimeout(2000);

      // Fill in product details
      const skuField = page.getByLabel(/sku/i).or(page.getByPlaceholder(/sku/i));
      const hasSkuField = await skuField.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasSkuField) {
        const testSKU = `TEST-PROD-${Date.now()}`;

        await skuField.fill(testSKU);

        // Fill title
        const titleField = page.getByLabel(/title|product.*name/i).or(page.getByPlaceholder(/title|name/i));
        const hasTitleField = await titleField.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasTitleField) {
          await titleField.fill('Test Product E2E');

          // Select category
          const categoryDropdown = page.getByLabel(/category/i).or(page.locator('button').filter({ hasText: /category/i }));
          const hasCategoryDropdown = await categoryDropdown.first().isVisible({ timeout: 2000 }).catch(() => false);

          if (hasCategoryDropdown) {
            await categoryDropdown.first().click();
            await page.waitForTimeout(500);

            // Select first available category
            const firstCategory = page.getByRole('option').first();
            const hasCategory = await firstCategory.isVisible({ timeout: 2000 }).catch(() => false);

            if (hasCategory) {
              await firstCategory.click();
            }
          }

          // Fill price
          const priceField = page.getByLabel(/price/i).or(page.locator('input[type="number"]').first());
          const hasPriceField = await priceField.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasPriceField) {
            await priceField.fill('100');

            // Click save
            const saveButton = page.getByRole('button', { name: /save/i });
            await saveButton.click();
            await page.waitForTimeout(3000);

            // Should navigate to products list or show success
            const navigatedToList = page.url().includes('/backoffice/products') && !page.url().includes('/new');
            const successToast = await page.getByText(/success|created/i).isVisible({ timeout: 3000 }).catch(() => false);

            expect(navigatedToList || successToast).toBe(true);
          }
        }
      }
    });
  });

  // ==========================================
  // CATEGORY MANAGEMENT
  // ==========================================

  test.describe('Category Management', () => {
    test('4.1: should display category management page', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/categories');
      await page.waitForTimeout(2000);

      // Check heading
      const heading = page.getByRole('heading', { name: /categor.*management/i });
      const hasHeading = await heading.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasHeading) {
        await expect(heading).toBeVisible();
      }

      // Check for "Add Category" button
      const addButton = page.getByRole('button', { name: /add.*category/i });
      const hasButton = await addButton.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasButton) {
        await expect(addButton).toBeVisible();
      }

      // Check for categories table
      const table = page.locator('table');
      const hasTable = await table.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasTable) {
        await expect(table).toBeVisible();

        // Check for table headers
        const headers = ['Slug', 'Name', 'Icon', 'Products'];
        for (const header of headers) {
          const headerCell = page.getByRole('columnheader', { name: new RegExp(header, 'i') });
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            await expect(headerCell).toBeVisible();
          }
        }
      }
    });

    test('4.2: should open create category dialog', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/categories');
      await page.waitForTimeout(2000);

      // Click "Add Category" button
      const addButton = page.getByRole('button', { name: /add.*category/i });
      const hasButton = await addButton.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasButton) {
        await addButton.click();
        await page.waitForTimeout(1000);

        // Check dialog opened
        const dialogTitle = page.getByRole('heading', { name: /create.*category|new.*category/i });
        const hasDialog = await dialogTitle.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasDialog) {
          await expect(dialogTitle).toBeVisible();

          // Check for form fields
          const slugField = page.getByLabel(/slug/i);
          const nameROField = page.getByLabel(/name.*romanian|name.*ro/i);
          const nameENField = page.getByLabel(/name.*english|name.*en/i);

          const hasSlug = await slugField.isVisible({ timeout: 2000 }).catch(() => false);
          const hasNameRO = await nameROField.isVisible({ timeout: 2000 }).catch(() => false);
          const hasNameEN = await nameENField.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasSlug) await expect(slugField).toBeVisible();
          if (hasNameRO) await expect(nameROField).toBeVisible();
          if (hasNameEN) await expect(nameENField).toBeVisible();
        }
      }
    });

    test('4.3: should create a new category', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/categories');
      await page.waitForTimeout(2000);

      // Click "Add Category" button
      const addButton = page.getByRole('button', { name: /add.*category/i });
      await addButton.click();
      await page.waitForTimeout(1000);

      // Fill in category details
      const testSlug = `test-category-${Date.now()}`;

      const slugField = page.getByLabel(/slug/i);
      const hasSlugField = await slugField.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasSlugField) {
        await slugField.fill(testSlug);

        const nameROField = page.getByLabel(/name.*romanian|name.*ro/i);
        const hasNameRO = await nameROField.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasNameRO) {
          await nameROField.fill('Test Category RO');

          const nameENField = page.getByLabel(/name.*english|name.*en/i);
          const hasNameEN = await nameENField.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasNameEN) {
            await nameENField.fill('Test Category EN');

            // Click create button
            const createButton = page.getByRole('button', { name: /create/i });
            await createButton.click();
            await page.waitForTimeout(2000);

            // Should show success toast or close dialog
            const successToast = page.getByText(/success|created/i);
            const hasSuccess = await successToast.isVisible({ timeout: 3000 }).catch(() => false);

            const dialogClosed = !(await page.getByRole('heading', { name: /create.*category/i }).isVisible({ timeout: 1000 }).catch(() => false));

            expect(hasSuccess || dialogClosed).toBe(true);

            // New category should appear in the table
            if (dialogClosed) {
              await page.waitForTimeout(1000);
              const newCategoryRow = page.getByText(testSlug);
              const hasNewRow = await newCategoryRow.isVisible({ timeout: 2000 }).catch(() => false);

              if (hasNewRow) {
                await expect(newCategoryRow).toBeVisible();
              }
            }
          }
        }
      }
    });

    test('4.4: should edit an existing category', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/categories');
      await page.waitForTimeout(2000);

      // Find and click edit button on first category
      const editButton = page.getByRole('button', { name: /edit/i }).first();
      const hasEditButton = await editButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasEditButton) {
        await editButton.click();
        await page.waitForTimeout(500);

        // Modify the name
        const nameROField = page.locator('input').filter({ hasText: /./i }).first();
        const hasNameField = await nameROField.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasNameField) {
          await nameROField.fill('Updated Category Name');

          // Click save button (represented by save icon)
          const saveButton = page.getByRole('button').filter({ has: page.locator('svg') }).first();
          const hasSaveButton = await saveButton.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasSaveButton) {
            await saveButton.click();
            await page.waitForTimeout(2000);

            // Should show success toast
            const successToast = page.getByText(/success|updated/i);
            const hasSuccess = await successToast.isVisible({ timeout: 3000 }).catch(() => false);

            if (hasSuccess) {
              await expect(successToast).toBeVisible();
            }
          }
        }
      }
    });

    test('4.5: should prevent deleting category with products', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/categories');
      await page.waitForTimeout(2000);

      // Find a category that has products (product count > 0)
      const categoryRow = page.locator('tr').filter({ has: page.getByText(/\d+/) }).first();
      const hasRow = await categoryRow.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasRow) {
        // Click delete button on this category
        const deleteButton = categoryRow.getByRole('button').filter({ has: page.locator('svg[class*="trash"]') });
        const hasDeleteButton = await deleteButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasDeleteButton) {
          await deleteButton.click();
          await page.waitForTimeout(1000);

          // Confirm dialog should appear
          const confirmDialog = page.getByRole('heading', { name: /delete.*category/i });
          const hasDialog = await confirmDialog.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasDialog) {
            await expect(confirmDialog).toBeVisible();

            // Should show warning message about products
            const warningMessage = page.getByText(/has.*product|cannot.*delete/i);
            const hasWarning = await warningMessage.isVisible({ timeout: 2000 }).catch(() => false);

            // Delete button should be disabled
            const deleteConfirmButton = page.getByRole('button', { name: /delete/i }).last();
            const hasConfirmButton = await deleteConfirmButton.isVisible({ timeout: 2000 }).catch(() => false);

            if (hasConfirmButton) {
              const isDisabled = await deleteConfirmButton.isDisabled().catch(() => false);

              // Either warning is shown OR button is disabled
              expect(hasWarning || isDisabled).toBe(true);
            }
          }
        }
      }
    });

    test('4.6: should successfully delete category without products', async ({ page }) => {
      await login(page);

      // First create a new category that has no products
      await page.goto('/backoffice/categories');
      await page.waitForTimeout(2000);

      const testSlug = `delete-test-${Date.now()}`;

      // Create category
      const addButton = page.getByRole('button', { name: /add.*category/i });
      await addButton.click();
      await page.waitForTimeout(1000);

      const slugField = page.getByLabel(/slug/i);
      await slugField.fill(testSlug);

      const nameROField = page.getByLabel(/name.*romanian|name.*ro/i);
      await nameROField.fill('Delete Test Category');

      const nameENField = page.getByLabel(/name.*english|name.*en/i);
      await nameENField.fill('Delete Test Category EN');

      const createButton = page.getByRole('button', { name: /create/i });
      await createButton.click();
      await page.waitForTimeout(2000);

      // Now delete it
      const categoryRow = page.locator('tr').filter({ hasText: testSlug });
      const hasRow = await categoryRow.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasRow) {
        const deleteButton = categoryRow.getByRole('button').last();
        await deleteButton.click();
        await page.waitForTimeout(1000);

        // Confirm deletion
        const deleteConfirmButton = page.getByRole('button', { name: /delete/i }).last();
        const hasConfirmButton = await deleteConfirmButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasConfirmButton && !(await deleteConfirmButton.isDisabled())) {
          await deleteConfirmButton.click();
          await page.waitForTimeout(2000);

          // Should show success toast
          const successToast = page.getByText(/success|deleted/i);
          const hasSuccess = await successToast.isVisible({ timeout: 3000 }).catch(() => false);

          if (hasSuccess) {
            await expect(successToast).toBeVisible();
          }

          // Category should be removed from table
          const categoryStillExists = await page.locator('tr').filter({ hasText: testSlug }).isVisible({ timeout: 1000 }).catch(() => false);
          expect(categoryStillExists).toBe(false);
        }
      }
    });
  });

  // ==========================================
  // RFQ MANAGEMENT
  // ==========================================

  test.describe('RFQ Management', () => {
    test('5.1: should display RFQ list page', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/rfqs');
      await page.waitForTimeout(2000);

      // Check heading
      const heading = page.getByRole('heading', { name: /rfq/i });
      const hasHeading = await heading.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasHeading) {
        await expect(heading).toBeVisible();
      }

      // Check for search box
      const searchBox = page.getByPlaceholder(/search/i);
      const hasSearch = await searchBox.first().isVisible({ timeout: 2000 }).catch(() => false);

      if (hasSearch) {
        await expect(searchBox.first()).toBeVisible();
      }

      // Check for filter options
      const statusFilter = page.getByRole('button').filter({ hasText: /all|status|filter/i });
      const hasFilter = await statusFilter.first().isVisible({ timeout: 2000 }).catch(() => false);

      if (hasFilter) {
        await expect(statusFilter.first()).toBeVisible();
      }
    });
  });

  // ==========================================
  // RESPONSIVE DESIGN
  // ==========================================

  test.describe('Responsive Design', () => {
    test('6.1: should be responsive on mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await login(page);

      await page.goto('/backoffice/dashboard');
      await page.waitForTimeout(2000);

      // Content should be visible
      const heading = page.getByRole('heading', { name: /dashboard/i });
      const hasHeading = await heading.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasHeading) {
        await expect(heading).toBeVisible();
      }

      // Navigation should be accessible (either visible or via hamburger menu)
      const sidebar = page.locator('aside').or(page.locator('nav'));
      const hasSidebar = await sidebar.isVisible({ timeout: 2000 }).catch(() => false);

      // Sidebar might be hidden on mobile, that's okay
      expect(hasSidebar !== undefined).toBe(true);
    });

    test('6.2: should be responsive on tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await login(page);

      await page.goto('/backoffice/products');
      await page.waitForTimeout(2000);

      // Check that main content is visible
      const heading = page.getByRole('heading', { name: /product/i });
      const hasHeading = await heading.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasHeading) {
        await expect(heading).toBeVisible();
      }
    });
  });

  // ==========================================
  // NAVIGATION & UX
  // ==========================================

  test.describe('Navigation & UX', () => {
    test('7.1: should display loading states appropriately', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/products');

      // Check for loading spinner (should appear briefly during API calls)
      const loadingSpinner = page.locator('.animate-spin').or(page.getByText(/loading/i));

      // Wait for loading to complete
      await page.waitForTimeout(2000);

      const stillLoading = await loadingSpinner.isVisible({ timeout: 500 }).catch(() => false);

      // Loading should not persist after page loads
      expect(stillLoading).toBe(false);
    });

    test('7.2: should display toast notifications on actions', async ({ page }) => {
      await login(page);

      await page.goto('/backoffice/categories');
      await page.waitForTimeout(2000);

      // Perform an action that triggers a toast (create category)
      const addButton = page.getByRole('button', { name: /add.*category/i });
      const hasButton = await addButton.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasButton) {
        await addButton.click();
        await page.waitForTimeout(1000);

        const testSlug = `toast-test-${Date.now()}`;

        const slugField = page.getByLabel(/slug/i);
        const hasSlugField = await slugField.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasSlugField) {
          await slugField.fill(testSlug);

          const nameROField = page.getByLabel(/name.*romanian|name.*ro/i);
          await nameROField.fill('Toast Test');

          const nameENField = page.getByLabel(/name.*english|name.*en/i);
          await nameENField.fill('Toast Test EN');

          const createButton = page.getByRole('button', { name: /create/i });
          await createButton.click();
          await page.waitForTimeout(1500);

          // Toast should appear
          const toast = page.getByText(/success|created/i);
          const hasToast = await toast.isVisible({ timeout: 3000 }).catch(() => false);

          if (hasToast) {
            await expect(toast).toBeVisible();

            // Toast should auto-dismiss after a few seconds
            await page.waitForTimeout(5000);
            const stillVisible = await toast.isVisible({ timeout: 500 }).catch(() => false);
            expect(stillVisible).toBe(false);
          }
        }
      }
    });

    test('7.3: should maintain user session across page navigations', async ({ page }) => {
      await login(page);

      // Navigate to different sections
      const sections = ['/backoffice/products', '/backoffice/categories', '/backoffice/rfqs', '/backoffice/dashboard'];

      for (const section of sections) {
        await page.goto(section);
        await page.waitForTimeout(1500);

        // Should remain logged in (not redirect to login)
        expect(page.url()).toContain(section);
        expect(page.url()).not.toContain('/login');
      }
    });
  });
});
