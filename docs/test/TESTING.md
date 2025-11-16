# Testing Guide - MetalPro Steel Craft Flow

## Overview

This document describes the automated testing infrastructure for the MetalPro Steel Craft Flow application. Tests run automatically at build time to ensure code quality before deployment.

---

## Testing Strategy

Our testing approach covers multiple levels:

1. **Unit Tests** - Component and function-level testing
2. **Integration Tests** - API and service integration testing
3. **E2E Tests** - Full user journey testing
4. **UI Tests** - Component rendering and interaction

---

## Test Stack

### Frontend Testing
- **Vitest** - Fast unit testing framework for Vite
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end browser testing
- **jsdom** - DOM implementation for unit tests

### Backend Testing
- **Jest** - JavaScript testing framework
- **Supertest** - HTTP integration testing
- **ts-jest** - TypeScript support for Jest

---

## Running Tests

### Frontend Tests

```bash
# Run all frontend unit tests
npm run test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run E2E tests
npm run e2e

# Run E2E tests with UI
npm run e2e:ui

# Run E2E tests in headed mode (see browser)
npm run e2e:headed
```

### Backend Tests

```bash
# Navigate to backend directory
cd backend

# Run all backend tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Build-Time Testing

**Important**: Tests run automatically before builds to ensure code quality.

### Frontend Build

```bash
# Build with tests (production)
npm run build
# This runs: npm run test:run && vite build

# Build without tests (development/CI override)
npm run build:skip-tests
```

### Backend Build

```bash
cd backend

# Build with tests
npm run build
# This runs: npm run test && tsc

# Build without tests
npm run build:skip-tests
```

---

## Test Organization

### Frontend Test Structure

```
steel-craft-flow/
├── src/
│   ├── pages/
│   │   └── __tests__/
│   │       ├── Index.test.tsx
│   │       └── Index.responsive.test.tsx
│   ├── components/
│   │   └── layout/
│   │       └── __tests__/
│   │           └── Header.test.tsx
│   └── test/
│       ├── setup.ts           # Global test setup
│       └── utils.tsx           # Test utilities
├── e2e/
│   └── phase1-infrastructure.spec.ts
├── vitest.config.ts
└── playwright.config.ts
```

### Backend Test Structure

```
backend/
├── src/
│   ├── __tests__/
│   │   └── health.test.ts
│   └── test/
│       └── setup.ts
└── jest.config.js
```

---

## Phase 1 Test Coverage

### Phase 1.1: Home Page Load ✅

**Unit Tests** (`src/pages/__tests__/Index.test.tsx`):
- ✅ Page loads within acceptable time
- ✅ MetalPro logo displays
- ✅ Contact ribbon with phone number
- ✅ Hero section with correct heading
- ✅ Three trust indicators visible
- ✅ Two CTA buttons present
- ✅ Statistics section displays
- ✅ Footer visible

**E2E Tests** (`e2e/phase1-infrastructure.spec.ts`):
- ✅ Real page load within 3 seconds
- ✅ All visual elements render correctly
- ✅ Interactive elements are clickable

### Phase 1.2: Header Navigation Links ✅

**Unit Tests** (`src/components/layout/__tests__/Header.test.tsx`):
- ✅ Logo navigation to home page
- ✅ Phone link with correct format
- ✅ Business hours display
- ✅ Search bar functionality
- ✅ Language switcher present
- ✅ Cart icon visible
- ✅ Account section present

**E2E Tests**:
- ✅ Logo click navigation
- ✅ Phone link interaction
- ✅ Contact ribbon visibility

### Phase 1.3: Responsive Design ✅

**Unit Tests** (`src/pages/__tests__/Index.responsive.test.tsx`):
- ✅ Mobile view (375px) adaptation
- ✅ Tablet view (768px) adaptation
- ✅ Desktop view (1280px) layout
- ✅ Viewport transition handling

**E2E Tests**:
- ✅ Mobile view rendering (375px)
- ✅ Tablet view rendering (768px)
- ✅ Desktop view rendering (1280px)
- ✅ Responsive transitions
- ✅ Interactive elements across viewports

---

## Writing New Tests

### Frontend Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Frontend E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should navigate to catalog', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Vezi Catalogul/i }).click();
  await expect(page).toHaveURL('/catalog');
});
```

### Backend API Test Example

```typescript
import request from 'supertest';
import app from '../app';

describe('GET /api/products', () => {
  it('should return products list', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('products');
  });
});
```

---

## Test Utilities

### Frontend Test Utilities

Located in `src/test/utils.tsx`:

```typescript
import { render } from '@/test/utils';
import { setViewportSize } from '@/test/utils';

// Render with all providers
render(<MyComponent />);

// Set viewport for responsive testing
setViewportSize(375, 667); // Mobile
```

### Mock Examples

```typescript
import { vi } from 'vitest';

// Mock a module
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isGuest: true,
  }),
}));

// Mock a function
const mockFn = vi.fn();
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:run
      - run: npm run e2e

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd backend && npm ci
      - run: cd backend && npm test
```

---

## Coverage Reports

### Viewing Coverage

```bash
# Frontend coverage
npm run test:coverage
open coverage/index.html

# Backend coverage
cd backend
npm run test:coverage
open coverage/index.html
```

### Coverage Goals

- **Unit Tests**: >80% coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: User flows verified

---

## Best Practices

### 1. Test Naming
```typescript
// ✅ Good
it('should display error message when login fails')

// ❌ Bad
it('test 1')
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('should add item to cart', () => {
  // Arrange
  render(<CartButton productId="123" />);

  // Act
  fireEvent.click(screen.getByRole('button'));

  // Assert
  expect(screen.getByText('1 item in cart')).toBeInTheDocument();
});
```

### 3. Avoid Implementation Details
```typescript
// ✅ Good - tests behavior
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

// ❌ Bad - tests implementation
expect(container.querySelector('.submit-btn')).toBeInTheDocument();
```

### 4. Clean Up After Tests
```typescript
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

---

## Troubleshooting

### Common Issues

#### Frontend Tests Failing

**Problem**: Component not rendering

**Solution**: Check that all mocks are set up correctly:
```typescript
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));
```

#### E2E Tests Timing Out

**Problem**: Page not loading in time

**Solution**: Increase timeout or check server is running:
```typescript
test.setTimeout(30000); // 30 seconds
```

#### Backend Tests Can't Connect

**Problem**: Port already in use

**Solution**: Use different port for tests (configured in `src/test/setup.ts`):
```typescript
process.env.PORT = '3002';
```

---

## Next Steps

### Planned Test Coverage

- **Phase 2**: Product Catalog tests
- **Phase 3**: Product Detail Page tests
- **Phase 4**: Cart & Checkout tests
- **Phase 5**: Authentication flow tests
- **Phase 6**: Admin dashboard tests

### Test Automation Roadmap

1. ✅ Set up testing infrastructure
2. ✅ Implement Phase 1 tests
3. ⏳ Add Phase 2-6 tests based on MANUAL_TEST_SCENARIOS.md
4. ⏳ Set up CI/CD pipelines
5. ⏳ Add visual regression testing
6. ⏳ Performance testing
7. ⏳ Load testing

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: November 15, 2025
**Version**: 1.0.0
