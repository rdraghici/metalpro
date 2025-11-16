# Testing Quick Start Guide

## Quick Commands

### Run All Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test

# E2E tests
npm run e2e
```

### Build with Tests
```bash
# Frontend
npm run build              # Tests run automatically

# Backend
cd backend && npm run build    # Tests run automatically
```

### Skip Tests (Emergency Only)
```bash
# Frontend
npm run build:skip-tests

# Backend
cd backend && npm run build:skip-tests
```

---

## Test Files Location

### Frontend
- **Unit Tests**: `src/pages/__tests__/` or `src/components/*/__tests__/`
- **E2E Tests**: `e2e/*.spec.ts`
- **Test Utils**: `src/test/utils.tsx`

### Backend
- **Unit Tests**: `backend/src/__tests__/`
- **Test Utils**: `backend/src/test/setup.ts`

---

## Phase 1 Test Status

| Scenario | Unit Tests | E2E Tests | Status |
|----------|-----------|-----------|--------|
| 1.1: Home Page Load | ✅ 9 tests | ✅ 8 tests | ✅ Complete |
| 1.2: Header Navigation | ✅ 7 tests | ✅ 3 tests | ✅ Complete |
| 1.3: Responsive Design | ✅ 13 tests | ✅ 4 tests | ✅ Complete |

**Total**: 29 unit tests + 15 E2E tests = **44 automated tests**

---

## Common Tasks

### Add New Test

1. Create test file in `__tests__/` directory:
```typescript
// src/components/MyComponent/__tests__/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

2. Run tests:
```bash
npm test
```

### View Test Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open in browser
open coverage/index.html
```

### Debug Failing Test

```bash
# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- Index.test

# Run E2E with UI
npm run e2e:ui
```

---

## Test Naming Convention

```
<Feature/Component>.<test-type>.test.ts(x)
```

Examples:
- `Index.test.tsx` - Unit tests for Index page
- `Index.responsive.test.tsx` - Responsive design tests
- `Header.test.tsx` - Header component tests
- `phase1-infrastructure.spec.ts` - E2E tests for Phase 1

---

## Need Help?

See full documentation: [TESTING.md](../TESTING.md)
