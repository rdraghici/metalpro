# MetalPro - Technical Implementation Plan

## Executive Summary

This document outlines the phased technical implementation plan for **MetalPro**, a B2B web platform for selling prime metal materials. The platform enables users to discover products, configure specifications, receive gross estimates, and submit RFQs (Request for Quote) for finalization with a dedicated sales team.

**Project Goal:** Build a modern, performant B2B e-commerce experience where users can explore metal materials (Profiles, Steel Plates, Pipes, Fasteners, Stainless Steel, Non-Ferrous Metals), configure specifications, and submit qualified RFQs to the sales team.

**Current Status:** Landing page with Hero Section, Category Grid, How It Works flow, Header, and Footer completed.

---

## Technology Stack

### Frontend Core
- **Framework:** React 18.3.1
- **Language:** TypeScript 5.8.3
- **Build Tool:** Vite 5.4.19
- **Compiler:** SWC (via @vitejs/plugin-react-swc)

### UI/UX Layer
- **Component Library:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS 3.4.17
- **Animations:** tailwindcss-animate
- **Icons:** lucide-react 0.462.0
- **Theming:** next-themes 0.3.0 (dark mode support)

### State Management & Data Fetching
- **Server State:** TanStack Query (React Query) 5.83.0
- **Form State:** React Hook Form 7.61.1
- **Form Validation:** Zod 3.25.76
- **Resolver:** @hookform/resolvers 3.10.0

### Routing & Navigation
- **Router:** React Router DOM 6.30.1

---

## Backend Technology Stack

### Backend Framework Options
**Recommended:** Node.js with Express/NestJS or Python with FastAPI

#### Option 1: Node.js + Express/NestJS (Recommended)
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js 4.x or NestJS 10.x
- **Language:** TypeScript 5.x (shared types with frontend)
- **Benefits:**
  - Type sharing with frontend
  - Fast development with unified language
  - Rich ecosystem for file processing (CSV/XLSX)
  - Easy integration with frontend team

#### Option 2: Python + FastAPI
- **Runtime:** Python 3.11+
- **Framework:** FastAPI 0.109+
- **Benefits:**
  - Excellent for data processing and BOM parsing
  - Strong typing with Pydantic
  - Auto-generated OpenAPI docs
  - High performance (async/await)

### Database Layer

#### Primary Database: PostgreSQL 15+
**Rationale:**
- ACID compliance for critical RFQ data
- Strong support for relational data (products, categories, RFQs)
- JSON/JSONB support for flexible cart snapshots
- Excellent performance with proper indexing
- Mature ecosystem and tooling

**Alternative:** MySQL 8+ or MariaDB 10.6+ (if team has existing expertise)

#### ORM/Query Builder
- **Node.js:** Prisma 5.x or TypeORM 0.3.x
- **Python:** SQLAlchemy 2.x with Alembic migrations

#### Database Schema Structure:
```sql
-- Core Tables
- products
- categories
- product_prices (historical pricing)
- rfqs (offer requests)
- rfq_items (line items in RFQ)
- users
- companies
- addresses
- attachments
- audit_logs
```

### Caching Layer
- **Redis 7+:** Session management, cart caching, rate limiting
- **Use Cases:**
  - Session storage for authenticated users
  - Cache product catalog for fast reads
  - Rate limiting for API endpoints
  - Job queue for async tasks (email sending, file processing)

### File Storage
- **Local Development:** Local filesystem
- **Production Options:**
  - **AWS S3:** Attachments, documents, BOM uploads
  - **Azure Blob Storage:** Alternative
  - **Cloudinary:** If image processing needed
  - **MinIO:** Self-hosted S3-compatible (on-premises option)

### Email Service
- **SendGrid:** Transactional emails (RFQ confirmations, notifications)
- **AWS SES:** Cost-effective alternative
- **Postmark:** High deliverability
- **Nodemailer:** For local development

### Background Jobs & Queue
- **Bull/BullMQ:** Redis-based job queue for Node.js
- **Celery:** For Python backend
- **Use Cases:**
  - Send email notifications
  - Process BOM uploads
  - Generate PDF quotes
  - Cleanup old sessions

### API Documentation
- **Swagger/OpenAPI 3.0:** Auto-generated API docs
- **Postman Collections:** For backend team testing
- **TypeScript Types:** Auto-generated from OpenAPI spec

### Authentication & Authorization
- **JWT (JSON Web Tokens):** Stateless authentication
- **bcrypt:** Password hashing
- **Express-rate-limit / fastapi-limiter:** Rate limiting
- **CORS:** Configured for frontend domain

### Logging & Monitoring
- **Winston (Node.js) / Loguru (Python):** Application logging
- **Sentry:** Error tracking and monitoring
- **Prometheus + Grafana:** Metrics and dashboards (optional)
- **Morgan (Node.js):** HTTP request logging

### DevOps & Infrastructure
- **Docker:** Containerization for all services
- **Docker Compose:** Local development environment
- **nginx:** Reverse proxy and load balancer
- **PM2 (Node.js):** Process manager for production
- **Gunicorn + Uvicorn (Python):** ASGI/WSGI server

### UI Components (shadcn/ui)
Complete suite of production-ready components:
- **Layout:** Card, Tabs, Accordion, Collapsible, Separator, Resizable Panels, Scroll Area
- **Forms:** Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Calendar, Date Picker, Input OTP
- **Navigation:** Navigation Menu, Breadcrumb, Dropdown Menu, Context Menu, Menubar, Sidebar
- **Feedback:** Toast (Sonner), Alert, Alert Dialog, Dialog, Sheet, Drawer, Tooltip, Hover Card, Popover
- **Data Display:** Table, Badge, Avatar, Progress, Skeleton, Chart (Recharts integration)
- **Actions:** Button, Toggle, Toggle Group

### Date & Time
- **Date Utilities:** date-fns 3.6.0
- **Date Picker:** react-day-picker 8.10.1

### Charts & Visualization
- **Charts:** Recharts 2.15.4 (for analytics, material weight/cost visualization)

### Additional Libraries
- **Carousels:** embla-carousel-react 8.6.0
- **Class Management:** clsx 2.1.1, tailwind-merge 2.6.0, class-variance-authority 0.7.1
- **Command Palette:** cmdk 1.1.1
- **Drawer:** vaul 0.9.9

### Development Tools
- **Linting:** ESLint 9.32.0 with TypeScript support
- **TypeScript ESLint:** typescript-eslint 8.38.0
- **PostCSS:** 8.5.6
- **Autoprefixer:** 10.4.21
- **Typography Plugin:** @tailwindcss/typography 0.5.16

### Build & Deployment
- **Package Manager:** npm (package-lock.json present)
- **Dev Server:** Vite Dev Server (port 8080)
- **Deployment Target:** Static hosting (Netlify, Vercel, AWS S3/CloudFront)

---

## Current Implementation Status

### ✅ Completed Components

#### Landing Page (Phase 1 - Complete)
- **Header** (`src/components/layout/Header.tsx`)
  - Contact ribbon with phone and hours
  - Logo and branding
  - Search bar with placeholder
  - Estimate cart button (badge showing 0 items)
  - "Cere Ofertă" CTA
  - Navigation menu with 6 main categories

- **Hero Section** (`src/components/home/HeroSection.tsx`)
  - Value proposition headline
  - Subtitle with B2B focus
  - Trust indicators (real-time estimates, specialist support, fast delivery)
  - Dual CTAs ("Vezi Catalogul", "Încarcă Lista BOM")
  - Stats section (500+ products, 24h response, 1000+ projects)

- **Category Grid** (`src/components/home/CategoryGrid.tsx`)
  - 6 product families with cards:
    1. Profile Metalice (UNP, HEA, IPE, UPN)
    2. Table de Oțel (DC01, S235JR, S355JR)
    3. Țevi și Tuburi (rectangular, round)
    4. Elemente Asamblare (fasteners, DIN/ISO)
    5. Oțel Inoxidabil (304, 316L, 321)
    6. Metale Neferoase (aluminum, copper, bronze)
  - Each card displays specs, standards, and CTA

- **How It Works** (`src/components/home/HowItWorks.tsx`)
  - 4-step process visualization
  - Step indicators with icons
  - CTAs for catalog exploration and BOM upload

- **Footer** (`src/components/layout/Footer.tsx`)
  - Company info and description
  - Quick links to categories
  - Services section
  - Contact information
  - Legal links (Terms, Privacy, GDPR)

### 🏗️ Architecture Setup
- **Routing:** React Router configured with Index and NotFound pages
- **State Management:** TanStack Query provider configured
- **UI System:** Toast notifications (Toaster + Sonner) and Tooltip provider
- **Styling:** Custom design tokens for industrial B2B aesthetic
- **Typography:** Inter font family with custom text scales
- **Color System:** HSL-based theming with primary, secondary, accent, muted, success, warning, info variants
- **Shadows:** Industrial shadow system (soft, medium, strong)
- **Animations:** Fade-in, slide-in, scale-in animations

---

## Phased Implementation Plan

### Phase 1: Foundation & Landing Page ✅ COMPLETED
**Status:** Complete
**Timeline:** Complete
**Components Delivered:** Header, Hero, CategoryGrid, HowItWorks, Footer

---

### Phase 2: Product Catalog & Discovery System
**Timeline:** 2-3 weeks
**Goal:** Build the product browsing and filtering experience

#### 2.1 Data Layer & Types
**File:** `src/types/product.ts`
```typescript
// Define core TypeScript interfaces:
// - Unit, Availability, Incoterm enums
// - Category, Product, ProductFamily interfaces
// - Indicative pricing structures
// - Delivery estimate types
```

**File:** `src/lib/api/products.ts`
```typescript
// Product data API (mock data for now, later REST/GraphQL)
// - getAllCategories()
// - getProductsByFamily()
// - getProductBySlug()
// - searchProducts()
```

**File:** `src/data/products.json` or `src/data/products.ts`
```typescript
// Seed data for initial 50-100 SKUs across all families
// Include: UNP profiles, HEA profiles, steel plates, pipes, fasteners
```

#### 2.2 Catalog Pages

**File:** `src/pages/Catalog.tsx`
- Main catalog listing page
- Breadcrumb navigation
- Category filter sidebar or top bar
- Product grid with pagination
- Applied filter chips
- Sort options (price, availability, name)

**File:** `src/pages/CategoryPage.tsx`
- Category-specific view (e.g., /profiles, /plates)
- Subfamily navigation
- Dynamic filtering based on category

**File:** `src/components/catalog/FilterPanel.tsx`
- Accordion-based filters:
  - Standard (EN 10025, EN 10219, DIN, ISO)
  - Grade (S235JR, S355JR, DC01, 304, 316L)
  - Dimensions (height, width, thickness ranges)
  - Finish (hot-rolled, galvanized, polished)
  - Availability (in stock, on order, backorder)
- Filter state management with URL sync
- Clear all filters action

**File:** `src/components/catalog/FilterChips.tsx`
- Display applied filters as removable chips
- Clear individual filters

**File:** `src/components/catalog/ProductGrid.tsx`
- Responsive grid layout
- Loading skeletons
- Empty state messaging

**File:** `src/components/catalog/ProductCard.tsx`
- Product image/icon
- Title and SKU
- Spec badges (grade, standard, dimensions)
- Indicative price range or "Request Quote"
- Stock badge (In Stock, On Order, Backorder)
- Estimated lead time
- "Add to Estimate" CTA

**File:** `src/components/catalog/Pagination.tsx`
- Page navigation
- Items per page selector
- Total results count

#### 2.3 Search Functionality

**File:** `src/components/search/SearchBar.tsx` (enhance existing Header search)
- Debounced search input
- Autosuggest dropdown
- Search by: product name, SKU, standard, grade, dimension

**File:** `src/components/search/SearchResults.tsx`
- Grouped results: Categories, Products, Keywords
- Keyboard navigation support

**File:** `src/hooks/useSearch.ts`
- Search state management
- Debounce logic
- TanStack Query integration

#### 2.4 Acceptance Criteria
- [ ] User can browse products by category
- [ ] Filters update product list in <300ms
- [ ] Applied filters display as removable chips
- [ ] Search autocomplete suggests relevant products
- [ ] Product cards show all required info (price, stock, specs)
- [ ] Pagination works correctly with filters applied
- [ ] URL reflects active filters and page (shareable links)

---

### Phase 3: Product Detail Page (PDP) & Configuration
**Timeline:** 2 weeks
**Goal:** Enable detailed product viewing and specification configuration

#### 3.1 Product Detail Page

**File:** `src/pages/ProductDetail.tsx`
- Product hero image/icon
- Title, SKU, producer
- Breadcrumb navigation
- Availability badge
- Estimated delivery date/window
- Add to Estimate CTA
- Related products section

**File:** `src/components/pdp/SpecTable.tsx`
- Comprehensive spec table:
  - Dimensions (height, width, thickness, length)
  - Steel grade and chemical composition
  - Mechanical properties
  - Standards compliance (EN, DIN, ISO)
  - Tolerances
  - Surface finish options
- Downloadable datasheet links (PDF)

**File:** `src/components/pdp/ConfigurationPanel.tsx`
- **Base Selling Unit Selector:** m, kg, pcs, bundle
- **Length Options:** Dropdown for 6m, 12m, or custom
- **Quantity Input:** Number input with unit display
- **Finish Selector:** Radio group or select
- **Cut to Length:** Toggle + cut list input table
- Real-time weight calculation display
- Real-time gross estimate calculation

**File:** `src/components/pdp/CutListEditor.tsx`
- Table for entering cut list:
  - Length (m)
  - Quantity (pcs)
  - Auto-calculate waste %
- Import/Export CSV functionality

**File:** `src/components/pdp/WeightEstimator.tsx`
- Display estimated weight in kg
- Formula display (for transparency)
- Updates on configuration change

**File:** `src/components/pdp/PriceEstimator.tsx`
- Display gross estimate with disclaimer
- Indicative unit price × quantity
- Breakdown: subtotal, VAT (indicative), delivery fee band
- **Disclaimer banner:** "Prețurile afișate sunt **estimative**. Oferta finală este confirmată de echipa de vânzări."

**File:** `src/components/pdp/DeliveryCue.tsx`
- Delivery window (e.g., "3-5 zile lucrătoare")
- Estimated delivery date
- Delivery fee band or "Calculated at quote"
- Special transport notice for heavy orders

**File:** `src/hooks/useProductConfig.ts`
- State management for product configuration
- Weight and price calculation logic
- Validation rules

#### 3.2 Acceptance Criteria
- [ ] PDP displays full spec table with downloadable docs
- [ ] Changing dimension/length updates weight and price in <150ms
- [ ] Cut to length functionality works with waste calculation
- [ ] Gross estimate disclaimer is visible and clear
- [ ] Add to Estimate adds configured product to cart
- [ ] Stock and delivery info is accurate and clear

---

### Phase 4: Estimate Cart & RFQ Flow
**Timeline:** 2-3 weeks
**Goal:** Build the estimate cart and RFQ submission system

#### 4.1 Estimate Cart State Management

**File:** `src/context/CartContext.tsx` or use TanStack Query + localStorage
- Cart state: lines, totals, disclaimers
- Actions: add, update, remove line items
- Persist to localStorage
- Clear cart on RFQ submission

**File:** `src/types/cart.ts`
```typescript
// CartLine, EstimateCart interfaces
// Totals calculation types
```

#### 4.2 Estimate Cart UI

**File:** `src/components/cart/EstimateCartDrawer.tsx`
- Slide-out drawer (Sheet component)
- Triggered from Header cart button
- Line items list
- Totals panel
- "Request Final Quote" CTA

**File:** `src/components/cart/EstimateCartPage.tsx`
- Full-page cart view
- Editable line items
- Remove item action
- Continue shopping CTA
- Proceed to RFQ CTA

**File:** `src/components/cart/CartLineItem.tsx`
- Product thumbnail and title
- Specs summary (grade, dimension, length, finish)
- Quantity input (editable inline)
- Unit selector
- Estimated weight display
- Indicative unit price and line subtotal
- Remove button

**File:** `src/components/cart/TotalsPanel.tsx`
- Subtotal (all line items)
- Estimated total weight (kg)
- VAT (indicative) - e.g., 19%
- Delivery fee band or "TBD by sales"
- **Grand Total (Gross Estimate)**
- Disclaimer checkbox: "I understand these are gross estimates"

#### 4.3 RFQ Form Flow

**File:** `src/pages/RFQForm.tsx`
- Multi-step form:
  1. Company Information
  2. Delivery Address
  3. Preferences & Incoterms
  4. Attachments & Notes
  5. Review & Submit

**File:** `src/components/rfq/CompanyInfoStep.tsx`
- Legal name (required)
- CUI/VAT number (required, validated format)
- Billing address (street, city, county, postal code, country)
- Contact person (required)
- Phone (required)
- Email (required)
- Business verification status display (if logged in)

**File:** `src/components/rfq/DeliveryAddressStep.tsx`
- Delivery address fields
- "Same as billing" checkbox
- Desired delivery date picker

**File:** `src/components/rfq/PreferencesStep.tsx`
- Incoterm selector (EXW, FCA, CPT, DAP, DDP)
- Payment terms preferences (informational)
- Special requirements textarea

**File:** `src/components/rfq/AttachmentsStep.tsx`
- File upload (CSV, XLSX, PDF, images)
- Cut list upload
- Technical drawings upload
- Notes textarea

**File:** `src/components/rfq/ReviewStep.tsx`
- Summary of company info
- Summary of delivery details
- Cart snapshot with totals
- Attachments list
- Final disclaimers
- Submit button

**File:** `src/components/rfq/ConfirmationScreen.tsx`
- Thank you message
- RFQ reference number
- Sales contact details
- Support hours
- "Return to Homepage" CTA
- Email confirmation sent notice

**File:** `src/lib/api/rfq.ts`
```typescript
// submitRFQ(data: RFQ) => POST to /api/rfq
// Send email to user and sales team
// Generate RFQ reference ID
```

#### 4.4 Acceptance Criteria
- [ ] Cart persists across sessions (localStorage)
- [ ] Line items are editable inline
- [ ] Totals update correctly on quantity/unit change
- [ ] RFQ form validates all required fields
- [ ] CUI/VAT validation works correctly
- [ ] File upload supports CSV, XLSX, PDF
- [ ] Submission creates qualified lead
- [ ] User and sales receive email confirmation
- [ ] Confirmation screen shows sales contact info

---

### Phase 5: BOM Upload & Auto-Mapping
**Timeline:** 2 weeks
**Goal:** Enable bulk product upload via CSV/XLSX

#### 5.1 BOM Upload Flow

**File:** `src/pages/BOMUpload.tsx`
- Drag & drop zone
- Template download link
- Upload button
- File format instructions

**File:** `src/components/bom/UploadDropzone.tsx`
- Drag & drop zone (react-dropzone or native)
- Accepted file types: CSV, XLSX
- File size limit: 10MB
- Preview uploaded file name

**File:** `src/components/bom/BOMMapper.tsx`
- Parse uploaded file
- Display preview table
- Auto-map columns to expected fields:
  - family, standard, grade, dimension, length_m, qty, unit, finish, notes
- Show matching confidence for each row
- Unmatched rows highlighted

**File:** `src/components/bom/UnmatchedRowMapper.tsx`
- Manual mapping UI for unmatched rows
- Family selector → filters spec → product selector
- Confirm mapped product

**File:** `src/lib/utils/bomParser.ts`
```typescript
// parseBOM(file: File) => BOMRow[]
// Auto-match rows to product SKUs
// Return match confidence scores
```

**File:** `src/lib/utils/csvExport.ts`
```typescript
// exportCartToCSV(cart: EstimateCart) => download CSV
// exportBOMTemplate() => download template
```

#### 5.2 Acceptance Criteria
- [ ] User can upload CSV/XLSX with BOM data
- [ ] System auto-maps 80%+ of standard formats
- [ ] Unmatched rows can be manually mapped
- [ ] Mapped products added to cart in bulk
- [ ] Validation errors shown for malformed files
- [ ] Downloadable CSV template provided

---

### Phase 6: Optional User Accounts & B2B Benefits
**Timeline:** 2-3 weeks
**Goal:** Add optional authentication for enhanced user convenience

> **IMPORTANT:** Authentication is 100% OPTIONAL. All core features (catalog browsing, product configuration, cart, RFQ submission, BOM upload) must work without requiring an account. Accounts offer convenience features only.

#### 6.0 Guest vs. Registered User Matrix

| Feature | Guest User | Registered User |
|---------|-----------|----------------|
| Browse catalog | ✅ Full access | ✅ Full access |
| Search products | ✅ Full access | ✅ Full access |
| Configure products | ✅ Full access | ✅ Full access |
| Add to cart | ✅ Full access | ✅ Full access |
| Submit RFQ | ✅ Full access | ✅ **Pre-filled company data** |
| Upload BOM | ✅ Full access | ✅ **+ Save as project** |
| View order history | ❌ Not available | ✅ Available |
| Save projects | ❌ Not available | ✅ Available |
| Saved addresses | ❌ Not available | ✅ Available |
| Business verification badge | ❌ Not available | ✅ Optional |

#### 6.1 Authentication System (Optional)

**File:** `src/context/AuthContext.tsx`
- Auth state management with **guest support**
- `user: User | null` - null indicates guest user
- `isGuest: boolean` - helper to check guest status
- Login, logout, signup actions
- JWT token storage and refresh (if using backend auth)
- Protected route wrapper (ONLY for `/account/*` routes)

```typescript
interface AuthContextType {
  user: User | null; // null = guest user
  isAuthenticated: boolean; // false = guest
  isGuest: boolean; // true when user === null
  isLoading: boolean;

  // Optional actions
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;

  // Helper for upselling
  promptSignup: (context: 'bom_save' | 'rfq_success' | 'order_history') => void;
}
```

**File:** `src/pages/Login.tsx`
- Email/password login
- "Continue as guest" prominent option
- "Forgot password" link
- SSO options (Google, Microsoft) - optional, future enhancement
- Clear value proposition: "Save projects, track orders, faster checkout"

**File:** `src/pages/Signup.tsx`
- Company signup form
- Business account (default) vs. Individual toggle
- CUI/VAT validation (optional field, validates if provided)
- Email verification flow (sent, but NOT blocking)
- **Guest escape hatch:** "Skip for now" button visible

**File:** `src/pages/ForgotPassword.tsx`
- Email input for password reset
- Confirmation screen

**File:** `src/lib/api/auth.ts`
```typescript
// login(email, password) - returns User object
// signup(userData) - creates account, returns User
// logout() - clears session
// refreshToken() - extends session (if using JWT)
// requestPasswordReset(email) - sends reset email
// checkEmailAvailability(email) - validation helper
```

#### 6.2 B2B Account Features (Require Authentication)

**File:** `src/pages/Account.tsx`
- **Protected route** - redirects to `/login` if guest
- Account dashboard with tabs:
  - Profile
  - Company Info
  - Saved Projects (BOM uploads)
  - Order History (past RFQs)
  - Saved Addresses
  - Preferences (optional, future)

**File:** `src/components/account/ProfileTab.tsx`
- User profile editing (name, email, phone)
- Contact information
- Password change
- Email verification status

**File:** `src/components/account/CompanyInfoTab.tsx`
- Company legal details (name, CUI, address, etc.)
- CUI/VAT validation status
- Business verification badge (if verified)
- Link to verification flow

**File:** `src/components/account/SavedProjectsTab.tsx`
- List of saved BOM projects
- Preview project details (products, quantities)
- "Load into cart" action
- "Duplicate project" action
- Delete project

**File:** `src/components/account/OrderHistoryTab.tsx`
- List of past RFQs with status:
  - `submitted` - sent to sales team
  - `acknowledged` - sales team reviewing
  - `in_progress` - preparing quote
  - `quoted` - quote sent to customer
  - `completed` - order fulfilled (future)
- "Reorder" action (loads RFQ items into cart)
- RFQ details modal (company info, products, notes)

**File:** `src/components/account/AddressesTab.tsx`
- Saved billing and delivery addresses
- Add/edit/delete addresses
- Set default billing/delivery address
- Address used to prefill RFQ form

#### 6.3 Business Verification Flow (Optional Enhancement)

> **NOTE:** This can be deferred to Phase 6C if backend admin panel is not ready.

**File:** `src/components/account/BusinessVerification.tsx`
- Upload verification documents (CUI certificate, trade registry extract)
- Verification status display:
  - `not_submitted` - no documents uploaded
  - `pending` - under review by admin
  - `verified` - approved, shows badge
  - `rejected` - need to re-submit
- Manual review by admin (requires backend)

**File:** `src/lib/api/verification.ts`
```typescript
// submitVerificationDocs(docs: File[]) - upload documents
// getVerificationStatus() - returns VerificationStatus
// Optional: adminApproveVerification(userId) - backend only
```

#### 6.4 Guest User Flow Enhancements

**File:** `src/components/common/SignupPrompt.tsx`
- Reusable component for gentle signup prompts
- Used after:
  - First successful RFQ submission: "Track this order? Sign up to view order history"
  - BOM upload completion: "Save this BOM for later? Create an account"
  - Second RFQ submission: "Create account to save time on future orders"
- "Maybe later" option always visible

**File:** `src/components/rfq/CompanyInfoStep.tsx` (Enhancement)
```typescript
// If logged in and verified
if (user && user.company) {
  // Prefill company data from user.company
  // Show: "Using saved company info (Edit)"
}

// If guest
if (!user) {
  // Show empty form (current behavior)
  // Show hint: "Have an account? Log in to prefill"
}
```

**File:** `src/components/bom/BOMMapper.tsx` (Enhancement)
```typescript
// Add "Save Project" button (disabled for guests)
if (isGuest) {
  <Button disabled>
    <Lock className="h-4 w-4" />
    Save Project (Sign up required)
  </Button>
} else {
  <Button onClick={saveProject}>
    Save Project
  </Button>
}
```

#### 6.5 Header Navigation Updates

**File:** `src/components/layout/Header.tsx`
```typescript
// Replace static "Login/Signup" with dynamic auth UI

// If guest
<Button variant="ghost" asChild>
  <Link to="/login">Cont</Link>
</Button>

// If authenticated
<DropdownMenu>
  <DropdownMenuTrigger>
    <Avatar>
      {user.company?.name.charAt(0) || user.name.charAt(0)}
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem asChild>
      <Link to="/account">Contul Meu</Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link to="/account/projects">Proiecte Salvate</Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link to="/account/orders">Istoric Comenzi</Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={logout}>
      Deconectare
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### 6.6 Acceptance Criteria

**Guest User Flow (No Regression):**
- [ ] Guest users can browse full catalog without login prompt
- [ ] Guest users can add products to cart without account
- [ ] Guest users can submit RFQ without creating account
- [ ] Guest users can upload BOM files without account
- [ ] Guest users receive RFQ confirmation email (no account needed)

**Optional Account Features:**
- [ ] User can optionally sign up for business account
- [ ] Signup is quick and non-blocking (email verification sent but not required to use account)
- [ ] CUI/VAT validation works if user provides CUI (optional field)
- [ ] Logged-in users can save BOM uploads as projects
- [ ] RFQ form prefills company data for logged-in users (with option to edit)
- [ ] Logged-in users can view order history (past RFQs)
- [ ] Logged-in users can save multiple delivery addresses
- [ ] Business verification badge visible if user completes verification (optional)

**User Experience:**
- [ ] Signup prompts are gentle and skippable (never blocking)
- [ ] Value proposition is clear ("Save time on next order", not "Create account to continue")
- [ ] "Continue as guest" option always visible
- [ ] Logout returns user to guest state (no broken functionality)

---

### Phase 6C: Production-Ready Infrastructure & Backend Integration
**Timeline:** 4-6 weeks (to be implemented after Phases 2-5, 7-9)
**Priority:** CRITICAL - Required before production launch
**Goal:** Replace all mock implementations with production-ready backend infrastructure

> **IMPORTANT:** This phase has been **extracted into a separate document** for detailed planning.
>
> **See:** [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md) for complete implementation guide.
>
> **Implementation Decisions:**
> - **Infrastructure:** AWS Cloud (S3, RDS PostgreSQL, ElastiCache Redis)
> - **Strategy:** Phased Rollout (6 weeks, incremental migration)
> - **Email Service:** SendGrid
>
> **Implementation Order:**
> 1. Complete frontend Phases 2-5, 7-9 first (with localStorage mocks)
> 2. Then implement Phase 6C (replace all mocks with production backend)
> 3. Finally proceed to Phase 10 (Back-Office System)

---

**For complete Phase 6C implementation details, see:**

### 📄 [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)

The production readiness document includes:

- ✅ **Backend API Setup** - Node.js, Express, Prisma, PostgreSQL
- ✅ **Database Schema** - Complete Prisma schema with all models
- ✅ **Authentication System** - JWT, bcrypt, session management
- ✅ **File Upload & AWS S3** - File storage integration
- ✅ **Email Service (SendGrid)** - Transactional emails
- ✅ **Security Hardening** - Rate limiting, CORS, validation
- ✅ **Docker & Deployment** - Production configuration
- ✅ **Monitoring & Logging** - Sentry, Winston, CloudWatch
- ✅ **Performance Optimization** - Caching, indexing, compression
- ✅ **AWS Infrastructure** - Complete setup checklist
- ✅ **Migration Plan** - Step-by-step migration from localStorage
- ✅ **Acceptance Criteria** - Complete validation checklist

**This phase will be implemented AFTER completing frontend Phases 2-5, 7-9.**

### Phase 7: Search Optimization & Advanced Filtering
**Timeline:** 1-2 weeks
**Goal:** Enhance search and filtering capabilities

#### 7.1 Advanced Search

**File:** `src/components/search/AdvancedSearchModal.tsx`
- Multi-criteria search form
- Search by: family, standard, grade, dimension range, producer
- Save search queries

**File:** `src/hooks/useAdvancedSearch.ts`
- Advanced search state
- Query builder logic

#### 7.2 Faceted Filtering

**File:** `src/components/catalog/FacetedFilters.tsx`
- Range sliders for numeric values (thickness, length, weight)
- Multi-select checkboxes for categorical filters
- Filter count badges

**File:** `src/lib/utils/filterUtils.ts`
```typescript
// applyFilters(products, filters)
// buildFilterOptions(products)
// syncFiltersWithURL()
```

#### 7.3 Acceptance Criteria
- [ ] Advanced search modal accessible from header
- [ ] Faceted filters show result counts
- [ ] Range sliders work smoothly for numeric values
- [ ] Filters persist in URL for sharing
- [ ] Saved searches feature works (if logged in)

---

### Phase 8: Analytics, SEO & Performance Optimization
**Timeline:** 1-2 weeks
**Goal:** Optimize for performance, SEO, and add analytics tracking

#### 8.1 Analytics Integration

**File:** `src/lib/analytics/gtm.ts`
```typescript
// Google Tag Manager integration
// Event tracking functions:
// - trackCatalogView(category)
// - trackFilterApply(filters)
// - trackPDPView(product)
// - trackAddToEstimate(product, qty)
// - trackRFQSubmit(rfq)
```

**File:** `src/hooks/useAnalytics.ts`
- Hook for tracking page views and events
- DataLayer push functions

**Events to Track:**
- `catalog_view`, `filter_apply`, `pdp_view`, `add_to_estimate`, `estimate_update`, `bom_upload`, `rfq_start`, `rfq_submit`, `rfq_success`, `contact_click`

#### 8.2 SEO Optimization

**File:** `src/components/seo/MetaTags.tsx`
- Dynamic meta tags component
- Open Graph tags
- Twitter Card tags

**File:** `src/lib/seo/generateMetadata.ts`
```typescript
// generateProductMetadata(product)
// generateCategoryMetadata(category)
```

**SEO Checklist:**
- [ ] Descriptive page titles (e.g., "Profile UNP – S235JR – MetalPro")
- [ ] Meta descriptions for all pages
- [ ] Schema.org Product markup on PDPs
- [ ] Clean URL slugs (/profiles/unp/unp-200-s235jr)
- [ ] Image alt text for all images
- [ ] Sitemap.xml generation
- [ ] Robots.txt configuration

#### 8.3 Performance Optimization

**Performance Targets:**
- FCP (First Contentful Paint): ≤ 2.0s
- TTI (Time to Interactive): ≤ 3.5s
- Filter interactions: ≤ 300ms
- PDP recalculations: ≤ 150ms

**Optimization Tasks:**
- [ ] Lazy load catalog images
- [ ] Code splitting by route
- [ ] Implement virtual scrolling for large product lists
- [ ] Optimize bundle size (tree-shaking, dynamic imports)
- [ ] Enable Vite build optimizations
- [ ] Add service worker for offline support (optional)
- [ ] Implement skeleton loaders for all async content

**File:** `src/components/ui/VirtualizedList.tsx`
- Virtual scrolling for product grids with 500+ items

**File:** `vite.config.ts` (update)
```typescript
// Add build optimizations:
// - minification
// - chunk splitting
// - preload directives
```

#### 8.4 Acceptance Criteria
- [ ] All key events tracked in GTM
- [ ] SEO metadata present on all pages
- [ ] Product schema markup validates
- [ ] Lighthouse score ≥ 90 for Performance, Accessibility, SEO
- [ ] First Contentful Paint ≤ 2.0s on catalog

---

### Phase 9: Internationalization (i18n) & Localization
**Timeline:** 1 week
**Goal:** Add Romanian (primary) and English (fallback) language support

#### 9.1 i18n Setup

**File:** `src/lib/i18n/config.ts`
- i18n configuration
- Locale detection
- Language switcher logic

**File:** `src/locales/ro.json`
```json
{
  "header": {
    "search_placeholder": "Caută profile, table, țevi...",
    "cart_button": "Estimare",
    "quote_button": "Cere Ofertă"
  },
  "catalog": {
    "filter_by": "Filtrează după",
    "clear_filters": "Șterge Filtre",
    "results_count": "{{count}} produse găsite"
  },
  // ... all UI strings
}
```

**File:** `src/locales/en.json`
```json
{
  "header": {
    "search_placeholder": "Search profiles, plates, pipes...",
    "cart_button": "Estimate",
    "quote_button": "Request Quote"
  },
  // ... English translations
}
```

**File:** `src/hooks/useTranslation.ts`
- Translation hook
- Locale switching
- Number/currency formatting

**File:** `src/components/LanguageSwitcher.tsx`
- Language toggle (RO/EN)
- Flag icons

#### 9.2 Locale-Aware Formatting

**File:** `src/lib/utils/formatting.ts`
```typescript
// formatCurrency(amount, currency, locale)
// formatNumber(number, locale)
// formatUnit(value, unit, locale)
// formatDate(date, locale)
```

#### 9.3 Acceptance Criteria
- [ ] All UI strings extracted to locale files
- [ ] Language switcher works correctly
- [ ] Numbers, currency, dates formatted per locale
- [ ] Units (m, kg, pcs) translated correctly
- [ ] RFQ emails sent in user's language

---

### Phase 10: Back-Office System & RFQ Management
**Timeline:** 4-5 weeks
**Goal:** Build comprehensive back-office system for operators to manage RFQs, pricing, and customer communications

#### 10.1 Back-Office Authentication & Authorization

**File:** `src/pages/backoffice/Login.tsx`
- Separate login page for back-office operators
- 2FA authentication (optional but recommended)
- Session timeout after inactivity

**RBAC (Role-Based Access Control):**
- **Admin:** Full system access, user management, product management
- **Backoffice:** RFQ management, quote generation, customer communication
- **User:** Customer-facing features only

#### 10.2 RFQ Dashboard & Workflow

**File:** `src/pages/backoffice/RFQDashboard.tsx`
- Real-time RFQ queue with status indicators
- Filter/sort by:
  - Status (submitted, acknowledged, in_progress, quoted, completed, cancelled)
  - Date range
  - Assigned operator
  - Company name
  - Estimated value range
- Bulk actions: assign, acknowledge, export to CSV
- Quick stats: Pending RFQs, Average response time, Conversion rate

**File:** `src/components/backoffice/RFQCard.tsx`
- Compact RFQ summary card
- Key info: Reference number, company, total value, status, age
- Quick actions: View details, assign, acknowledge

**File:** `src/pages/backoffice/RFQDetails.tsx`
- **Customer Information Section:**
  - Company details (legal name, CUI/VAT)
  - Contact person, phone, email
  - Billing and delivery addresses
  - Business verification status
  - Past RFQs history

- **Cart/Order Details Section:**
  - Line items table with:
    - Product SKU, title, family
    - Specifications (grade, dimensions, finish, cut list)
    - Requested quantity and unit
    - Estimated weight
    - Indicative unit price (from frontend)
    - **Editable final unit price** (operator input)
    - **Editable final subtotal**
    - **Internal notes** per line item

- **Totals Section:**
  - Estimated subtotal (from frontend)
  - **Final subtotal** (operator calculated)
  - VAT calculation
  - **Delivery/transport cost** (operator input)
  - **Special fees** (cutting, processing) (operator input)
  - **Grand total**

- **Attachments Section:**
  - View uploaded files (BOM, drawings, docs)
  - Download individual files or ZIP all
  - Add internal documents (quotes, calculations)

- **Status & Assignment:**
  - Current status with timeline
  - Assign to operator dropdown
  - Status change actions (acknowledge, start work, send quote, complete, cancel)
  - Status history log

- **Communication Section:**
  - **Internal comments** (visible only to back-office)
  - **Customer-facing notes** (visible in customer portal)
  - Activity timeline (status changes, comments, emails sent)

**File:** `src/components/backoffice/PricingEditor.tsx`
- Inline editing for line item pricing
- Bulk pricing actions (apply margin, apply discount)
- Price validation (warn if below cost)
- Real-time total recalculation

**File:** `src/components/backoffice/QuoteGenerator.tsx`
- **Generate PDF Quote:**
  - Professional quote template
  - Company letterhead
  - Line items with final pricing
  - Terms and conditions
  - Valid until date
  - Payment terms
  - Delivery terms (incoterm)
  - Signature block

- **Email Quote to Customer:**
  - Pre-filled email template
  - Attach PDF quote
  - CC operator email
  - Track email sent status

#### 10.3 Product Management

**File:** `src/pages/backoffice/ProductList.tsx`
- Full product catalog with inactive products
- Bulk actions: activate/deactivate, delete, export
- Filter by family, availability, active status

**File:** `src/pages/backoffice/ProductEdit.tsx`
- Full product CRUD:
  - Basic info (SKU, title, family, category)
  - Specifications (dimensions, grade, standards)
  - Pricing (min/max, currency, unit)
  - Inventory (availability, stock levels - future)
  - Documents (upload datasheets, certificates)

**File:** `src/components/backoffice/ProductImporter.tsx`
- Bulk import products via CSV
- Column mapping wizard
- Validation and error handling
- Import preview before commit

**File:** `src/components/backoffice/PricingManager.tsx`
- Historical pricing view
- Price update with validity dates
- Bulk price updates (by category, family, supplier)

#### 10.4 Company Verification Workflow

**File:** `src/pages/backoffice/VerificationQueue.tsx`
- List of pending business verifications
- Filter by submission date, company name
- Quick approve/reject actions

**File:** `src/pages/backoffice/CompanyVerificationDetails.tsx`
- Company registration details
- CUI/VAT validation (API integration or manual)
- Uploaded verification documents viewer
- Approve/reject with notes
- Notify user via email on decision

#### 10.5 Analytics & Reporting

**File:** `src/pages/backoffice/AnalyticsDashboard.tsx`
- **KPI Cards:**
  - Total RFQs (this month)
  - Pending RFQs
  - Average response time
  - Quote-to-order conversion rate
  - Total quoted value (this month)

- **Charts:**
  - RFQs over time (line chart)
  - RFQs by status (pie chart)
  - Top products by RFQ count (bar chart)
  - Average RFQ value trend
  - Operator performance (RFQs processed, avg time)

- **Reports:**
  - Export RFQ report (date range, status, company)
  - Export sales pipeline report
  - Product performance report

**File:** `src/components/backoffice/ReportExporter.tsx`
- Export to CSV/Excel
- Date range selector
- Custom column selection

#### 10.6 User & Permissions Management

**File:** `src/pages/backoffice/UserManagement.tsx`
- List all users (customers + back-office operators)
- Filter by role, verification status, active status
- User details: RFQs submitted, orders placed, lifetime value

**File:** `src/components/backoffice/UserEditor.tsx`
- Edit user role (user → admin, user → backoffice)
- Activate/deactivate user
- Reset password
- View audit log for user

#### 10.7 Email Templates & Notifications

**File:** `backend/src/templates/emails/`
- `rfq-confirmation.html` - Customer confirmation on RFQ submission
- `rfq-acknowledged.html` - RFQ acknowledged by operator
- `quote-ready.html` - Final quote ready with PDF attachment
- `verification-approved.html` - Business verification approved
- `verification-rejected.html` - Business verification rejected
- `rfq-completed.html` - RFQ marked as completed (order placed offline)

**Email Service Configuration:**
```typescript
// backend/src/services/EmailService.ts
export class EmailService {
  async sendRFQConfirmation(rfq: RFQ, user: User): Promise<void>
  async sendRFQAcknowledged(rfq: RFQ, operator: User): Promise<void>
  async sendQuoteReady(rfq: RFQ, quotePdfUrl: string): Promise<void>
  async sendVerificationDecision(company: Company, approved: boolean): Promise<void>
  async notifyOperatorNewRFQ(rfq: RFQ, operators: User[]): Promise<void>
}
```

#### 10.8 Workflow Automation

**Background Jobs:**
```typescript
// backend/src/jobs/rfq-jobs.ts

// Auto-acknowledge RFQs after 1 hour if not manually acknowledged
export async function autoAcknowledgeRFQs(): Promise<void>

// Send reminder to operator if RFQ pending for > 24 hours
export async function sendOperatorReminders(): Promise<void>

// Cleanup old draft RFQs (never submitted)
export async function cleanupDraftRFQs(): Promise<void>

// Generate daily RFQ summary email for managers
export async function sendDailySummary(): Promise<void>
```

**Cron Schedule (using Bull queue):**
- Every hour: Auto-acknowledge RFQs
- Daily at 9 AM: Send operator reminders
- Daily at 6 PM: Send daily summary
- Weekly: Cleanup old drafts

#### 10.9 Acceptance Criteria
- [ ] Back-office operators can log in with role-based access
- [ ] RFQ dashboard displays all submitted RFQs with filters
- [ ] Operators can assign RFQs to themselves or others
- [ ] Operators can update line item pricing and calculate totals
- [ ] Operators can generate PDF quotes with company branding
- [ ] Quote email sends to customer with PDF attachment
- [ ] Status changes are logged in audit trail
- [ ] Internal comments are hidden from customers
- [ ] Customer-facing notes visible in customer portal (if implemented)
- [ ] Analytics dashboard shows key metrics in real-time
- [ ] Product management allows full CRUD operations
- [ ] Bulk product import works with CSV files
- [ ] Company verification workflow approves/rejects businesses
- [ ] Email notifications sent at each workflow stage

#### 10.10 Back-Office Component Hierarchy

```
BackOfficeApp
├── BackOfficeRouter
│   ├── BackOfficeLogin
│   ├── BackOfficeDashboard (Analytics)
│   ├── RFQDashboard
│   │   ├── RFQFilters
│   │   ├── RFQStats
│   │   └── RFQList
│   │       └── RFQCard[]
│   ├── RFQDetails
│   │   ├── CustomerInfoPanel
│   │   ├── CartDetailsTable
│   │   │   └── LineItemRow[]
│   │   │       └── PricingEditor
│   │   ├── TotalsPanel
│   │   ├── AttachmentsPanel
│   │   ├── StatusPanel
│   │   │   └── StatusTimeline
│   │   ├── CommentsPanel
│   │   │   ├── InternalComments
│   │   │   └── CustomerNotes
│   │   └── QuoteGenerator
│   │       ├── PDFPreview
│   │       └── EmailComposer
│   ├── ProductManagement
│   │   ├── ProductList
│   │   ├── ProductEdit
│   │   ├── ProductImporter
│   │   └── PricingManager
│   ├── VerificationQueue
│   │   ├── VerificationList
│   │   └── CompanyVerificationDetails
│   ├── UserManagement
│   │   ├── UserList
│   │   └── UserEditor
│   └── Analytics
│       ├── KPICards
│       ├── RFQCharts
│       ├── ProductPerformance
│       └── ReportExporter
└── BackOfficeNav (Sidebar)
```

---

### Phase 11: Customer Portal (Optional - Future Enhancement)
**Timeline:** 2 weeks
**Goal:** Allow authenticated customers to track their RFQ status

**Features:**
- View submitted RFQs with current status
- Download final quotes (PDF)
- View customer-facing notes from operators
- Upload additional documents to existing RFQ
- Reorder previous RFQs
- View order history

---

## Component Hierarchy (Full Application)

```
App
├── Router
│   ├── Index (Landing Page)
│   │   ├── Header
│   │   ├── HeroSection ✅
│   │   ├── CategoryGrid ✅
│   │   ├── HowItWorks ✅
│   │   └── Footer ✅
│   ├── Catalog
│   │   ├── Header
│   │   ├── Breadcrumb
│   │   ├── FilterPanel
│   │   │   ├── FilterAccordion
│   │   │   └── FilterChips
│   │   ├── ProductGrid
│   │   │   └── ProductCard[]
│   │   ├── Pagination
│   │   └── Footer
│   ├── CategoryPage (/:family)
│   │   ├── Header
│   │   ├── Breadcrumb
│   │   ├── CategoryHero
│   │   ├── FilterPanel
│   │   ├── ProductGrid
│   │   └── Footer
│   ├── ProductDetail (/:family/:slug)
│   │   ├── Header
│   │   ├── Breadcrumb
│   │   ├── ProductHero
│   │   ├── SpecTable
│   │   ├── ConfigurationPanel
│   │   │   ├── UnitSelector
│   │   │   ├── QuantityInput
│   │   │   ├── LengthSelector
│   │   │   ├── FinishSelector
│   │   │   └── CutListEditor
│   │   ├── WeightEstimator
│   │   ├── PriceEstimator
│   │   ├── DeliveryCue
│   │   ├── DisclaimerBanner
│   │   ├── RelatedProducts
│   │   └── Footer
│   ├── EstimateCart (/cart)
│   │   ├── Header
│   │   ├── CartLineItem[]
│   │   ├── TotalsPanel
│   │   ├── DisclaimerBanner
│   │   └── Footer
│   ├── RFQForm (/rfq)
│   │   ├── Header
│   │   ├── StepIndicator
│   │   ├── CompanyInfoStep
│   │   ├── DeliveryAddressStep
│   │   ├── PreferencesStep
│   │   ├── AttachmentsStep
│   │   ├── ReviewStep
│   │   └── Footer
│   ├── RFQConfirmation (/rfq/confirmation)
│   │   ├── Header
│   │   ├── ConfirmationScreen
│   │   └── Footer
│   ├── BOMUpload (/bom)
│   │   ├── Header
│   │   ├── UploadDropzone
│   │   ├── BOMMapper
│   │   ├── UnmatchedRowMapper
│   │   └── Footer
│   ├── Login (/login)
│   │   └── LoginForm
│   ├── Signup (/signup)
│   │   └── SignupForm
│   ├── Account (/account)
│   │   ├── Header
│   │   ├── AccountSidebar
│   │   ├── ProfileTab
│   │   ├── CompanyInfoTab
│   │   ├── SavedProjectsTab
│   │   ├── OrderHistoryTab
│   │   ├── AddressesTab
│   │   └── Footer
│   ├── NotFound ✅
│   └── ...
├── EstimateCartDrawer (global)
├── SearchResults (global)
├── ToastProvider ✅
└── AuthProvider
```

---

## Data Model Implementation

### TypeScript Interfaces

**File:** `src/types/index.ts`

```typescript
// Enums
export type Unit = 'm' | 'kg' | 'pcs' | 'bundle';
export type Availability = 'in_stock' | 'on_order' | 'backorder';
export type Incoterm = 'EXW' | 'FCA' | 'CPT' | 'DAP' | 'DDP';
export type ProductFamily = 'profiles' | 'plates' | 'pipes' | 'fasteners' | 'stainless' | 'nonferrous';
export type RFQStatus = 'submitted' | 'acknowledged' | 'in_progress' | 'quoted' | 'completed' | 'cancelled';

// Category
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parentId?: string | null;
}

// Product
export interface Product {
  id: string;
  slug: string;
  family: ProductFamily;
  title: string;
  sku: string;
  standards: string[];
  grade: string;
  dimensions: Record<string, string | number>;
  lengthOptionsM?: number[];
  baseUnit: Unit;
  densityKgPerM3?: number;
  sectionProps?: Record<string, number>;
  availability: Availability;
  producer?: string;
  docs?: Array<{ label: string; url: string }>;
  indicativePrice: {
    currency: 'RON' | 'EUR';
    unit: Unit;
    min?: number;
    max?: number;
  };
  deliveryEstimate?: {
    windowDays?: [number, number];
    date?: string;
    feeBand?: string;
  };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Cart Line
export interface CartLine {
  id: string;
  productId: string;
  product?: Product; // populated for display
  specs: {
    grade?: string;
    standard?: string;
    dimensionSummary?: string;
    lengthM?: number;
    finish?: string;
    cutList?: Array<{ lengthM: number; qty: number }>;
  };
  quantity: number;
  unit: Unit;
  estWeightKg?: number;
  indicativeUnitPrice?: number;
  indicativeSubtotal?: number;
}

// Estimate Cart
export interface EstimateCart {
  id: string;
  lines: CartLine[];
  totals: {
    estWeightKg: number;
    estSubtotal: number;
    vatIndicative?: number;
    deliveryFeeBand?: string;
  };
  currency: 'RON' | 'EUR';
  disclaimerAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Address
export interface Address {
  street: string;
  city: string;
  county?: string;
  postalCode?: string;
  country: string;
}

// Contact
export interface Contact {
  person: string;
  phone: string;
  email: string;
}

// Company
export interface Company {
  legalName: string;
  cuiVat: string;
  billingAddress: Address;
  deliveryAddress?: Address;
  contact: Contact;
  isVerifiedBusiness?: boolean;
  incotermPref?: Incoterm;
}

// RFQ
export interface RFQ {
  id: string;
  referenceNumber: string;
  company: Company;
  cartSnapshot: EstimateCart;
  desiredDeliveryDate?: string;
  incoterm?: Incoterm;
  notes?: string;
  attachments?: Array<{
    name: string;
    type: 'csv' | 'xlsx' | 'pdf' | 'image';
    url: string;
  }>;
  status: RFQStatus;
  createdAt: string;
  updatedAt: string;
}

// BOM Row
export interface BOMRow {
  rawLine: string;
  mappedProductId?: string;
  quantity?: number;
  unit?: Unit;
  lengthM?: number;
  grade?: string;
  standard?: string;
  dimensionSummary?: string;
  matchConfidence?: number;
  isMatched: boolean;
}

// User
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyId?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
}

// Saved Project
export interface SavedProject {
  id: string;
  userId: string;
  name: string;
  description?: string;
  cart: EstimateCart;
  createdAt: string;
  updatedAt: string;
}
```

---

---

## Backend Architecture & Database Design

### System Architecture Diagram

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   React SPA     │◄───────►│   API Gateway    │◄───────►│   PostgreSQL    │
│  (Frontend)     │  HTTPS  │   (Express/      │   SQL   │   Database      │
│                 │         │    NestJS)       │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     │                            │
                                     │                            │
                                     ▼                            ▼
                            ┌──────────────────┐         ┌─────────────────┐
                            │   Redis Cache    │         │   File Storage  │
                            │   & Job Queue    │         │   (S3/Local)    │
                            └──────────────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  Email Service   │
                            │  (SendGrid/SES)  │
                            └──────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  Back-Office UI  │
                            │  (Admin Panel)   │
                            └──────────────────┘
```

### Database Schema (PostgreSQL)

#### Complete Schema Definition

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PRODUCTS & CATALOG
-- =====================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    family VARCHAR(50) NOT NULL CHECK (family IN ('profiles', 'plates', 'pipes', 'fasteners', 'stainless', 'nonferrous')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    standards TEXT[], -- Array of standards: ['EN 10025', 'EN 10219']
    grade VARCHAR(100),
    dimensions JSONB, -- Flexible: {"height": 200, "width": 190, "thickness": 8}
    length_options_m DECIMAL[], -- Array: [6, 12]
    base_unit VARCHAR(20) NOT NULL CHECK (base_unit IN ('m', 'kg', 'pcs', 'bundle')),
    density_kg_per_m3 DECIMAL(10,4),
    section_props JSONB, -- Section properties for calculations
    availability VARCHAR(50) DEFAULT 'in_stock' CHECK (availability IN ('in_stock', 'on_order', 'backorder')),
    producer VARCHAR(255),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_family ON products(family);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_availability ON products(availability);
CREATE INDEX idx_products_grade ON products(grade);
CREATE INDEX idx_products_standards ON products USING GIN(standards);

CREATE TABLE product_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    currency VARCHAR(3) DEFAULT 'RON' CHECK (currency IN ('RON', 'EUR', 'USD')),
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('m', 'kg', 'pcs', 'bundle')),
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_prices_product_id ON product_prices(product_id);
CREATE INDEX idx_product_prices_valid_from ON product_prices(valid_from);

CREATE TABLE product_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50), -- 'pdf', 'image', 'certificate'
    file_size_bytes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_documents_product_id ON product_documents(product_id);

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'backoffice')),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legal_name VARCHAR(500) NOT NULL,
    cui_vat VARCHAR(100) UNIQUE NOT NULL,
    registration_number VARCHAR(100),
    is_verified_business BOOLEAN DEFAULT false,
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    incoterm_pref VARCHAR(10) CHECK (incoterm_pref IN ('EXW', 'FCA', 'CPT', 'DAP', 'DDP')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_cui_vat ON companies(cui_vat);
CREATE INDEX idx_companies_verification_status ON companies(verification_status);

CREATE TABLE user_companies (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    role_in_company VARCHAR(100), -- 'owner', 'employee', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, company_id)
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address_type VARCHAR(50) NOT NULL CHECK (address_type IN ('billing', 'delivery', 'both')),
    street VARCHAR(500),
    city VARCHAR(255),
    county VARCHAR(255),
    postal_code VARCHAR(50),
    country VARCHAR(100) DEFAULT 'Romania',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (company_id IS NOT NULL OR user_id IS NOT NULL)
);

CREATE INDEX idx_addresses_company_id ON addresses(company_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- =====================================================
-- RFQs (OFFER REQUESTS) - CORE BUSINESS LOGIC
-- =====================================================

CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., "RFQ-2025-00001"
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,

    -- Company info snapshot (at time of submission)
    company_legal_name VARCHAR(500),
    company_cui_vat VARCHAR(100),

    -- Contact info snapshot
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),

    -- Addresses snapshot (JSONB for flexibility)
    billing_address JSONB,
    delivery_address JSONB,

    -- Cart snapshot with all line items
    cart_snapshot JSONB NOT NULL, -- Complete EstimateCart interface

    -- Preferences
    desired_delivery_date DATE,
    incoterm VARCHAR(10) CHECK (incoterm IN ('EXW', 'FCA', 'CPT', 'DAP', 'DDP')),
    notes TEXT,

    -- Status tracking
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'acknowledged', 'in_progress', 'quoted', 'completed', 'cancelled')),

    -- Calculated totals (denormalized for performance)
    total_items INTEGER DEFAULT 0,
    estimated_total_value DECIMAL(12,2),
    estimated_total_weight_kg DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'RON',

    -- Assignment to back-office operator
    assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE,

    -- Final quote data (populated by back-office)
    final_quote_amount DECIMAL(12,2),
    final_quote_notes TEXT,
    final_quote_pdf_url VARCHAR(500),
    quoted_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_rfqs_reference_number ON rfqs(reference_number);
CREATE INDEX idx_rfqs_user_id ON rfqs(user_id);
CREATE INDEX idx_rfqs_company_id ON rfqs(company_id);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_rfqs_assigned_to_user_id ON rfqs(assigned_to_user_id);
CREATE INDEX idx_rfqs_created_at ON rfqs(created_at DESC);

CREATE TABLE rfq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,

    -- Product snapshot at time of RFQ
    product_sku VARCHAR(100),
    product_title VARCHAR(500),
    product_family VARCHAR(50),

    -- Specifications
    specs JSONB, -- grade, standard, dimensions, length, finish, cutList

    -- Quantities
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,

    -- Estimates
    estimated_weight_kg DECIMAL(10,2),
    indicative_unit_price DECIMAL(10,2),
    indicative_subtotal DECIMAL(12,2),

    -- Final pricing (populated by back-office)
    final_unit_price DECIMAL(10,2),
    final_subtotal DECIMAL(12,2),
    final_notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rfq_items_rfq_id ON rfq_items(rfq_id);
CREATE INDEX idx_rfq_items_product_id ON rfq_items(product_id);

CREATE TABLE rfq_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    file_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(50), -- 'csv', 'xlsx', 'pdf', 'image'
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes INTEGER,
    uploaded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rfq_attachments_rfq_id ON rfq_attachments(rfq_id);

CREATE TABLE rfq_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rfq_status_history_rfq_id ON rfq_status_history(rfq_id);

CREATE TABLE rfq_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- internal notes only visible to back-office
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rfq_comments_rfq_id ON rfq_comments(rfq_id);
CREATE INDEX idx_rfq_comments_is_internal ON rfq_comments(is_internal);

-- =====================================================
-- SAVED PROJECTS
-- =====================================================

CREATE TABLE saved_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cart_data JSONB NOT NULL, -- EstimateCart interface
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_projects_user_id ON saved_projects(user_id);

-- =====================================================
-- AUDIT & LOGGING
-- =====================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'view'
    entity_type VARCHAR(100) NOT NULL, -- 'rfq', 'product', 'user', etc.
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- SESSIONS (if using database sessions)
-- =====================================================

CREATE TABLE sessions (
    sid VARCHAR(255) PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_sessions_expire ON sessions(expire);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all relevant tables
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON rfqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saved_projects_updated_at BEFORE UPDATE ON saved_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate RFQ reference number
CREATE SEQUENCE rfq_reference_seq START 1;

CREATE OR REPLACE FUNCTION generate_rfq_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reference_number = 'RFQ-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' ||
                           LPAD(nextval('rfq_reference_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_rfq_reference_trigger BEFORE INSERT ON rfqs
    FOR EACH ROW WHEN (NEW.reference_number IS NULL)
    EXECUTE FUNCTION generate_rfq_reference();
```

---

## API Endpoints (Backend Requirements)

### Public API (No Auth Required)

#### Products API
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details
- `GET /api/products` - List products (with filters, pagination)
  - Query params: `family`, `grade`, `standard`, `availability`, `minPrice`, `maxPrice`, `page`, `limit`, `sort`
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `GET /api/search?q=...` - Search products

#### RFQ API (Guest Submissions)
- `POST /api/rfq` - Submit RFQ (guest or authenticated)
  - Request body: Complete RFQ data including cart, company info, contact, addresses
  - Response: `{ id, referenceNumber, status, confirmationEmailSent }`

### Authenticated API (JWT Required)

#### Auth API
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/logout` - User logout (invalidate token)
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email/:token` - Verify email address

#### User API
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password
- `GET /api/user/rfqs` - List user's RFQs with status
- `GET /api/user/rfqs/:id` - Get specific RFQ details

#### Saved Projects API
- `GET /api/user/projects` - List saved projects
- `POST /api/user/projects` - Save project (cart snapshot)
- `GET /api/user/projects/:id` - Get project details
- `PUT /api/user/projects/:id` - Update project
- `DELETE /api/user/projects/:id` - Delete project

#### Company & Address API
- `GET /api/user/company` - Get user's company info
- `PUT /api/user/company` - Update company info
- `GET /api/user/addresses` - List user's addresses
- `POST /api/user/addresses` - Add address
- `PUT /api/user/addresses/:id` - Update address
- `DELETE /api/user/addresses/:id` - Delete address

#### Verification API
- `POST /api/verification/submit` - Submit business verification docs
- `GET /api/verification/status` - Get verification status
- `GET /api/verification/documents` - List uploaded documents

### Back-Office API (Admin/Backoffice Role Required)

#### RFQ Management API
- `GET /api/backoffice/rfqs` - List all RFQs with filters
  - Query params: `status`, `assignedTo`, `dateFrom`, `dateTo`, `companyName`, `page`, `limit`, `sort`
- `GET /api/backoffice/rfqs/:id` - Get RFQ full details
- `PUT /api/backoffice/rfqs/:id/status` - Update RFQ status
- `PUT /api/backoffice/rfqs/:id/assign` - Assign RFQ to operator
- `POST /api/backoffice/rfqs/:id/comments` - Add comment to RFQ
- `GET /api/backoffice/rfqs/:id/comments` - Get RFQ comments
- `PUT /api/backoffice/rfqs/:id/items/:itemId` - Update line item final pricing
- `POST /api/backoffice/rfqs/:id/quote` - Generate and send final quote
  - Updates final_quote_amount, final_quote_notes, generates PDF
  - Sends email to customer
- `GET /api/backoffice/rfqs/:id/history` - Get status change history

#### Product Management API
- `GET /api/backoffice/products` - List all products (with inactive)
- `POST /api/backoffice/products` - Create product
- `PUT /api/backoffice/products/:id` - Update product
- `DELETE /api/backoffice/products/:id` - Soft delete product
- `POST /api/backoffice/products/bulk-import` - Bulk import products (CSV)
- `PUT /api/backoffice/products/:id/pricing` - Update product pricing

#### Company Verification API
- `GET /api/backoffice/companies/pending` - List pending verifications
- `PUT /api/backoffice/companies/:id/verify` - Approve/reject company verification
- `GET /api/backoffice/companies/:id/documents` - View verification documents

#### Analytics API
- `GET /api/backoffice/analytics/dashboard` - Dashboard metrics
  - Total RFQs, conversion rate, average RFQ value, popular products
- `GET /api/backoffice/analytics/rfqs` - RFQ analytics
- `GET /api/backoffice/analytics/products` - Product performance

#### User Management API
- `GET /api/backoffice/users` - List all users
- `GET /api/backoffice/users/:id` - Get user details
- `PUT /api/backoffice/users/:id` - Update user (role, status)
- `DELETE /api/backoffice/users/:id` - Deactivate user

### BOM Upload API
- `POST /api/bom/parse` - Upload and parse BOM file (CSV/XLSX)
  - Returns: Parsed rows with auto-match confidence
- `POST /api/bom/match` - Confirm product mappings
  - Returns: Validated cart data ready for RFQ

---

## Testing Strategy

### Unit Tests
- **Framework:** Vitest
- **Coverage Target:** ≥ 80%
- **Focus Areas:**
  - Utility functions (formatters, calculators, validators)
  - Custom hooks (useSearch, useProductConfig, useCart)
  - Data transformers (BOM parser, filter utils)

### Integration Tests
- **Framework:** React Testing Library
- **Focus Areas:**
  - Component interactions (filter panel + product grid)
  - Form validation (RFQ form, login form)
  - Cart operations (add, update, remove)

### E2E Tests
- **Framework:** Playwright or Cypress
- **Critical User Flows:**
  1. Browse catalog → filter products → view PDP → add to cart → submit RFQ
  2. Upload BOM → auto-map products → add to cart → submit RFQ
  3. User signup → business verification → save project → load project

### Accessibility Testing
- **Tool:** axe DevTools, WAVE
- **Target:** WCAG 2.2 AA compliance
- **Focus Areas:**
  - Keyboard navigation
  - Screen reader support
  - Color contrast
  - Form labels and ARIA attributes

---

## Deployment & CI/CD

### Build Process
```bash
npm run build           # Production build
npm run build:dev       # Development build
npm run preview         # Preview production build locally
```

### Environment Variables
**File:** `.env.local`
```bash
VITE_API_BASE_URL=https://api.metalpro.ro
VITE_GTM_ID=GTM-XXXXXXX
VITE_SENTRY_DSN=https://...
VITE_ENV=production
```

### Deployment Targets
1. **Netlify** (recommended for static hosting)
   - Auto-deploy from `main` branch
   - Preview deployments for PRs
   - Edge functions for API proxying (optional)

2. **Vercel**
   - Similar features to Netlify
   - Serverless functions for API

3. **AWS S3 + CloudFront**
   - S3 bucket for static assets
   - CloudFront for CDN and SSL
   - Lambda@Edge for dynamic routing

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Performance Budgets

### Bundle Size Targets
- **Main Bundle:** ≤ 200 KB (gzipped)
- **Vendor Bundle:** ≤ 150 KB (gzipped)
- **Total JS:** ≤ 350 KB (gzipped)
- **CSS:** ≤ 50 KB (gzipped)

### Performance Metrics (Lighthouse)
- **Performance:** ≥ 90
- **Accessibility:** ≥ 95
- **Best Practices:** ≥ 95
- **SEO:** ≥ 95

### Core Web Vitals
- **LCP (Largest Contentful Paint):** ≤ 2.5s
- **FID (First Input Delay):** ≤ 100ms
- **CLS (Cumulative Layout Shift):** ≤ 0.1

---

## Security Considerations

### Frontend Security
- **XSS Prevention:** Sanitize all user inputs, use React's built-in escaping
- **CSRF Protection:** Use anti-CSRF tokens for state-changing operations
- **Content Security Policy:** Implement strict CSP headers
- **Dependency Scanning:** Regular `npm audit` and Dependabot alerts
- **Sensitive Data:** Never store sensitive data in localStorage (only cart, preferences)

### Authentication Security
- **JWT Tokens:** Store in httpOnly cookies (if backend supports)
- **Token Refresh:** Implement silent token refresh
- **Password Requirements:** Min 8 chars, complexity rules
- **Rate Limiting:** Implement on login/signup endpoints

### GDPR Compliance
- **Cookie Consent:** Explicit consent banner for analytics cookies
- **Data Export:** Allow users to export their data
- **Data Deletion:** Allow users to request account deletion
- **Privacy Policy:** Link in footer
- **Data Processing Agreement:** For B2B customers

---

## Documentation & Knowledge Transfer

### Developer Documentation
- **README.md:** Project setup, scripts, contributing guidelines
- **ARCHITECTURE.md:** High-level architecture overview
- **COMPONENT_LIBRARY.md:** Component API documentation
- **API_DOCUMENTATION.md:** Backend API specs (OpenAPI/Swagger)

### User Documentation
- **Help Center:** In-app help pages
- **FAQ:** Common questions about ordering, RFQs, pricing
- **Video Tutorials:** How to use BOM upload, configure products

### Code Documentation
- **JSDoc Comments:** For all exported functions and components
- **Storybook:** Component library documentation (optional)
- **Type Definitions:** Comprehensive TypeScript types

---

## Risk Mitigation

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Poor performance with 500+ SKUs | High | Implement virtual scrolling, lazy loading, code splitting |
| BOM auto-mapping accuracy | Medium | Provide manual mapping UI, improve matching algorithms over time |
| Complex weight calculations | Medium | Pre-calculate and store section properties, validate with sales team |
| Browser compatibility | Low | Test on Chrome, Firefox, Safari, Edge; use polyfills if needed |
| Backend API delays | Medium | Implement optimistic UI updates, loading states, error handling |

### Business Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Gross estimate accuracy | High | Clear disclaimers, sales team review before quoting |
| CUI/VAT validation failures | Medium | Implement robust validation, fallback to manual verification |
| User confusion on B2B flow | Medium | Clear UX copy, tooltips, onboarding flow |
| Low conversion from estimate to RFQ | High | A/B test CTAs, simplify RFQ form, add trust signals |

---

## Success Metrics (KPIs)

### Product Metrics
- **Catalog Engagement:** Average products viewed per session
- **Filter Usage:** % of users who apply filters
- **Search Usage:** % of users who use search
- **PDP Engagement:** Time spent on PDP, scroll depth

### Conversion Metrics
- **Add to Estimate Rate:** % of PDP views that result in add to cart
- **Cart Abandonment Rate:** % of carts not converted to RFQ
- **RFQ Submission Rate:** % of cart views that result in RFQ submission
- **Conversion Time:** Average time from first visit to RFQ submission

### Business Metrics
- **RFQs per Month:** Total qualified leads generated
- **Average RFQ Value:** Average estimated value per RFQ
- **Quote-to-Order Conversion:** % of RFQs that result in orders (tracked offline)
- **Customer Satisfaction:** NPS score from post-RFQ survey

### Technical Metrics
- **Page Load Time:** Average FCP and TTI
- **Error Rate:** % of sessions with JS errors
- **API Response Time:** P95 response times for key endpoints
- **Uptime:** 99.9% availability target

---

## Future Enhancements (Post-MVP)

### Phase 11: Mobile App (React Native)
- Native iOS/Android app for field engineers
- Quick product lookup and RFQ submission
- Offline mode for catalog browsing

### Phase 12: AI-Powered Recommendations
- "Customers who bought this also bought..."
- Smart BOM completion (suggest missing items)
- Auto-suggest alternatives for out-of-stock items

### Phase 13: Real-Time Pricing (Phase 2)
- Integration with supplier APIs for real-time pricing
- Dynamic pricing based on market conditions
- Volume tier discounts

### Phase 14: 3D Visualization
- 3D models of profiles and parts
- Dimension visualization for better understanding
- Cut list visualization in 3D

### Phase 15: Integration with ERP Systems
- SAP, Oracle, Microsoft Dynamics integration
- Direct order placement from customer's ERP
- Inventory sync

---

---

## RFQ Workflow & Business Process

### End-to-End RFQ Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     CUSTOMER JOURNEY                                     │
└─────────────────────────────────────────────────────────────────────────┘

1. PRODUCT DISCOVERY
   ├── User browses catalog / searches products
   ├── Applies filters (grade, dimensions, availability)
   ├── Views product detail pages
   └── Configures specifications (quantity, length, finish)

2. CART BUILDING
   ├── Adds products to Estimate Cart
   ├── Reviews line items with gross estimates
   ├── Sees total weight, VAT (indicative), delivery fee band
   └── Accepts disclaimer: "Prices are estimates only"

3. RFQ SUBMISSION
   ├── Clicks "Request Final Quote" → redirects to RFQ Form
   ├── Step 1: Company Info (legal name, CUI/VAT, contact)
   ├── Step 2: Delivery Address (billing & delivery)
   ├── Step 3: Preferences (incoterm, desired delivery date)
   ├── Step 4: Attachments (BOM, drawings, cut lists)
   ├── Step 5: Review & Submit
   └── Frontend POST /api/rfq with complete cart snapshot

4. BACKEND PROCESSING
   ├── API validates RFQ data (company, CUI/VAT format, cart)
   ├── Saves RFQ to database with status = 'submitted'
   ├── Auto-generates reference number (e.g., RFQ-2025-00042)
   ├── Saves cart snapshot (JSONB) for historical accuracy
   ├── Saves line items to rfq_items table
   ├── Uploads attachments to S3/local storage
   ├── Creates rfq_status_history entry
   └── Triggers email notifications

5. EMAIL NOTIFICATIONS (Async via Job Queue)
   ├── Customer: "RFQ Confirmation" email with reference number
   ├── Back-office: "New RFQ Received" notification to operators
   └── Email includes summary: company, total value, # of items

┌─────────────────────────────────────────────────────────────────────────┐
│                   BACK-OFFICE OPERATOR JOURNEY                           │
└─────────────────────────────────────────────────────────────────────────┘

6. RFQ ASSIGNMENT
   ├── Operator logs into Back-Office Dashboard
   ├── Sees new RFQ in queue (status: submitted)
   ├── Reviews company info, cart details, attachments
   ├── Assigns RFQ to self (or manager assigns)
   └── Status changes to 'acknowledged'
        └── Triggers email: "RFQ Acknowledged" to customer

7. PRICING & QUOTE GENERATION
   ├── Operator reviews each line item
   ├── Checks current market prices for materials
   ├── Edits final_unit_price for each line item
   ├── Adds transport cost (based on weight, distance, incoterm)
   ├── Adds special fees (cutting, processing)
   ├── System recalculates grand total
   ├── Operator adds internal notes (not visible to customer)
   ├── Status changes to 'in_progress'
   └── Operator clicks "Generate Quote"

8. QUOTE PDF GENERATION
   ├── Backend generates PDF with:
   │   ├── Company letterhead
   │   ├── Customer details
   │   ├── Line items with final pricing
   │   ├── Totals (subtotal, VAT, transport, grand total)
   │   ├── Terms & conditions
   │   ├── Valid until date (e.g., +14 days)
   │   ├── Payment terms
   │   └── Signature block
   ├── PDF saved to S3 with unique URL
   ├── Updates rfq.final_quote_pdf_url
   ├── Updates rfq.final_quote_amount
   └── Status changes to 'quoted'

9. QUOTE DELIVERY
   ├── Operator clicks "Send Quote to Customer"
   ├── Email composer pre-filled with template
   ├── Operator reviews/edits email text
   ├── Attaches PDF quote
   ├── Sends email (via SendGrid/SES)
   ├── Logs email sent in activity timeline
   └── Triggers email: "Quote Ready" to customer with PDF

10. CUSTOMER RESPONSE (Offline)
    ├── Customer receives quote via email
    ├── Reviews pricing, terms, delivery
    ├── Contacts operator via phone/email
    ├── Negotiates pricing (optional)
    ├── Places order offline (PO, phone, email)
    └── Operator updates status to 'completed'

11. ORDER COMPLETION
    ├── Operator marks RFQ as 'completed'
    ├── Adds final notes (PO number, delivery date agreed)
    ├── Creates rfq_status_history entry
    ├── Optional: Triggers email: "Order Confirmed" to customer
    └── RFQ moves to completed queue

┌─────────────────────────────────────────────────────────────────────────┐
│                          STATUS FLOW DIAGRAM                             │
└─────────────────────────────────────────────────────────────────────────┘

submitted → acknowledged → in_progress → quoted → completed
                                               ↘
                                                cancelled
```

### RFQ Status Definitions

| Status | Description | Triggered By | Customer Notification |
|--------|-------------|--------------|----------------------|
| **submitted** | RFQ received from customer | Frontend POST /api/rfq | RFQ Confirmation email |
| **acknowledged** | RFQ assigned to operator | Operator assigns to self | RFQ Acknowledged email |
| **in_progress** | Operator working on pricing | Operator starts pricing | None (internal) |
| **quoted** | Quote generated and ready | Operator generates PDF | Quote Ready email (with PDF) |
| **completed** | Order placed and fulfilled | Operator marks complete | Optional: Order Confirmed |
| **cancelled** | RFQ cancelled by customer or ops | Operator or customer | Cancellation email |

---

## Key Technical Decisions Summary

### 1. Estimate Cart: Frontend vs. Backend Storage
**Decision:** **Frontend-only (localStorage)** for guest users, **Backend** for authenticated users

**Rationale:**
- Guests can browse and build cart without signup friction
- Cart persists across sessions via localStorage
- Authenticated users: cart synced to backend (saved_projects table)
- On RFQ submission, full cart snapshot saved to `rfqs.cart_snapshot` (JSONB)

### 2. Product Pricing: Database Storage
**Decision:** Store **indicative price ranges** (min/max) in `product_prices` table

**Rationale:**
- Display price ranges to give customers ballpark estimates
- Historical pricing tracked with `valid_from` and `valid_to` dates
- Final pricing always determined by back-office operator
- Allows future automation (auto-quoting for standard items)

### 3. RFQ Snapshot vs. References
**Decision:** **Snapshot cart data** in `rfqs.cart_snapshot` (JSONB) + **normalize line items** in `rfq_items`

**Rationale:**
- JSONB snapshot preserves exact cart state at submission time
- Normalized `rfq_items` table allows:
  - Back-office pricing edits
  - Reporting and analytics
  - Product performance tracking
- Balance between data integrity and query performance

### 4. Email Service: Transactional vs. Marketing
**Decision:** **SendGrid** for transactional emails, **separate tool** for marketing (future)

**Rationale:**
- SendGrid reliable for critical RFQ notifications
- Templates stored in backend with variable interpolation
- Delivery tracking and bounce handling built-in
- Marketing emails (newsletters, promotions) handled separately

### 5. File Storage: S3 vs. Local
**Decision:** **Local storage for development**, **AWS S3 for production**

**Rationale:**
- Development: simple local filesystem (./uploads/)
- Production: S3 for scalability, reliability, CDN integration
- Backend uses abstraction layer (FileStorageService) to switch between implementations

---

## Conclusion

This technical implementation plan provides a comprehensive roadmap for building **MetalPro**, a modern B2B metal materials marketplace with full backend support for offer request management and back-office operations. The phased approach ensures iterative delivery of value while maintaining code quality, performance, and user experience standards.

**Key Deliverables:**
1. **Customer-Facing Frontend:** Product catalog, cart, RFQ submission
2. **Backend API:** PostgreSQL database, REST API, authentication, file storage
3. **Back-Office System:** RFQ management, pricing, quote generation, email automation
4. **Database:** Comprehensive schema with audit logging, status tracking, and historical data

**Current Status:** Phase 1 complete (Landing Page)
**Next Steps:**
1. Set up backend infrastructure (PostgreSQL, Express/NestJS, Redis)
2. Implement database schema and migrations
3. Begin Phase 2 (Product Catalog & Discovery System)
4. Develop Phase 4 (Estimate Cart & RFQ Flow) in parallel with backend
5. Build Phase 10 (Back-Office System) after RFQ submission is live

---

## Appendix: File Structure

```
steel-craft-flow/
├── public/
│   ├── images/
│   ├── docs/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── account/
│   │   ├── bom/
│   │   ├── cart/
│   │   ├── catalog/
│   │   ├── home/ ✅
│   │   ├── layout/ ✅
│   │   ├── pdp/
│   │   ├── rfq/
│   │   ├── search/
│   │   ├── seo/
│   │   └── ui/ ✅
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── data/
│   │   └── products.ts
│   ├── hooks/
│   │   ├── use-analytics.ts
│   │   ├── use-cart.ts
│   │   ├── use-mobile.tsx ✅
│   │   ├── use-product-config.ts
│   │   ├── use-search.ts
│   │   └── use-toast.ts ✅
│   ├── lib/
│   │   ├── analytics/
│   │   ├── api/
│   │   ├── i18n/
│   │   ├── seo/
│   │   ├── utils/ ✅
│   │   └── validation/
│   ├── locales/
│   │   ├── ro.json
│   │   └── en.json
│   ├── pages/
│   │   ├── Account.tsx
│   │   ├── BOMUpload.tsx
│   │   ├── Catalog.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── EstimateCart.tsx
│   │   ├── Index.tsx ✅
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx ✅
│   │   ├── ProductDetail.tsx
│   │   ├── RFQConfirmation.tsx
│   │   ├── RFQForm.tsx
│   │   └── Signup.tsx
│   ├── types/
│   │   ├── index.ts
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   └── rfq.ts
│   ├── App.css ✅
│   ├── App.tsx ✅
│   ├── index.css ✅
│   ├── main.tsx ✅
│   └── vite-env.d.ts ✅
├── docs/
│   └── TECHNICAL_IMPLEMENTATION_PLAN.md ✅
├── .env.local
├── .gitignore ✅
├── components.json ✅
├── eslint.config.js ✅
├── index.html ✅
├── package.json ✅
├── postcss.config.js ✅
├── README.md ✅
├── tailwind.config.ts ✅
├── tsconfig.json ✅
├── tsconfig.app.json ✅
├── tsconfig.node.json ✅
└── vite.config.ts ✅
```

---

**Document Version:** 1.0
**Last Updated:** 2025-01-18
**Author:** Claude (Anthropic)
**Project:** MetalPro - B2B Metal Materials Marketplace