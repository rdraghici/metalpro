# MetalDirect

B2B e-commerce platform for industrial metal materials. Browse catalogs, upload BOMs, and get instant quotes for steel profiles, plates, pipes, and fasteners.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite 5** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **i18next** - Internationalization (Romanian/English)
- **TanStack Query** - Data fetching and caching
- **React Hook Form + Zod** - Form validation

### Backend
- **Node.js** with Express
- **MongoDB** - Database
- **JWT** - Authentication

### Testing
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Testing Library** - Component testing

## Project Structure

```
steel-craft-flow/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom hooks
│   ├── context/           # React context providers
│   ├── lib/               # Utility libraries
│   └── locales/           # Translation files
├── backend/               # Backend API
├── config/                # Configuration files
├── docker/                # Docker configuration
├── test/                  # Test files
│   ├── data/             # Test data files
│   ├── e2e/              # End-to-end tests
│   ├── unit/             # Unit tests
│   └── setup/            # Test setup files
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (for backend)

### Installation

```bash
# Install dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### Development

```bash
# Start frontend dev server (port 8080)
npm run dev

# Start backend dev server (port 3000)
cd backend && npm run dev
```

Visit `http://localhost:8080` to view the application.

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3000
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Testing
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Generate coverage report
- `npm run e2e` - Run E2E tests
- `npm run e2e:ui` - Run E2E tests with UI
- `npm run e2e:headed` - Run E2E tests in headed mode

## Key Features

- **Product Catalog** - Browse metal materials by category
- **Advanced Filtering** - Filter by standard, grade, dimensions, availability
- **BOM Upload** - Upload bill of materials for bulk quotes
- **Multi-language** - Romanian and English support
- **User Accounts** - Save projects and order history
- **Guest Mode** - Browse and request quotes without account
- **Responsive Design** - Mobile, tablet, and desktop optimized

## Configuration Files

All configuration files are located in the `config/` directory:
- `vite.config.ts` - Vite configuration
- `vitest.config.ts` - Vitest test configuration
- `playwright.config.ts` - Playwright E2E configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `eslint.config.js` - ESLint configuration
- `tsconfig.json` - TypeScript configuration

## Docker

Docker configuration is available in the `docker/` directory:

```bash
cd docker
docker-compose up
```

## Documentation

- [Testing Guide](./TESTING.md) - Comprehensive testing documentation
- [GTM Setup](./GTM_Set_up.md) - Google Tag Manager integration

## License

Proprietary - MetalDirect © 2024

## Contact

**Website**: https://metal-direct.ro
**Email**: vanzari@metal-direct.ro
**Phone**: +40 xxx xxx xxx
