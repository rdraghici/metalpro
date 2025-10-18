# Manual Test Scenarios - Steel Craft Flow

## Overview

This document provides detailed manual test scenarios for testing the Steel Craft Flow application. Each scenario follows the **Given-When-Then** format for clarity and ease of execution.

**Test Environment**: http://localhost:8081/

---

## Phase 1: Core Infrastructure & Design System

### Test Scenario 1.1: Home Page Load

**Priority**: Critical
**Estimated Time**: 2 minutes


**Given**: User is on a browser


**When**: User navigates to http://localhost:8081/


**Then**:
- [ ] Page loads within 3 seconds
- [ ] MetalPro logo is visible in the header
- [ ] Contact ribbon displays phone number: "+40 xxx xxx xxx (L-V 08:00-16:30)"
- [ ] Hero section displays heading "Materiale Metalice pentru Proiecte B2B"
- [ ] Three trust indicators are visible: "Estimare în timp real", "Support specialist", "Livrare rapidă"
- [ ] Two CTA buttons are visible: "Vezi Catalogul" and "Încarcă Lista BOM"
- [ ] Statistics section shows: "500+ Produse disponibile", "24h Timp răspuns ofertă", "1000+ Proiecte realizate"
- [ ] Footer is visible at bottom of page

---

### Test Scenario 1.2: Header Navigation Links

**Priority**: High

**Estimated Time**: 3 minutes


**Given**: User is on the home page


**When**: User looks at the header navigation menu


**Then**:
- [ ] Six navigation links are visible:
  - Profile Metalice
  - Table de Oțel
  - Țevi și Tuburi
  - Elemente de Asamblare
  - Oțel Inoxidabil
  - Metale Neferoase


**When**: User clicks on "Profile Metalice"

**Then**:
- [ ] Browser navigates to /catalog/profiles
- [ ] Page displays "Profile Metalice" category
- [ ] Products shown are filtered to profiles only


**When**: User clicks the MetalPro logo

**Then**:
- [ ] Browser navigates back to home page (/)

**Repeat**: Test all six navigation links to ensure they navigate to correct category pages

---

### Test Scenario 1.3: Responsive Design - Mobile View

**Priority**: Medium

**Estimated Time**: 5 minutes


**Given**: User is on the home page

**When**: User resizes browser to mobile width (375px)

**Then**:
- [ ] Header adapts to mobile layout
- [ ] Navigation menu becomes hamburger menu or stacks vertically
- [ ] Hero section text remains readable
- [ ] CTA buttons stack vertically
- [ ] Statistics section adapts to single column
- [ ] Product grid (on catalog) shows 1 column


**When**: User resizes to tablet width (768px)

**Then**:
- [ ] Product grid shows 2 columns
- [ ] Header remains functional
- [ ] All interactive elements are clickable


**When**: User resizes to desktop width (1280px)

**Then**:
- [ ] Product grid shows 3-4 columns
- [ ] Full header navigation is visible

---

## Phase 2: Product Catalog & Discovery System

### Test Scenario 2.1: Navigate to Catalog

**Priority**: Critical

**Estimated Time**: 2 minutes


**Given**: User is on the home page

**When**: User clicks the "Vezi Catalogul" button

**Then**:
- [ ] Browser navigates to /catalog
- [ ] URL changes to http://localhost:8081/catalog
- [ ] Hero section displays "Catalog Produse"
- [ ] Breadcrumb shows: Home → Catalog
- [ ] Filter panel is visible on the left side
- [ ] Product grid displays products on the right side
- [ ] Pagination controls are visible at the bottom
- [ ] "X produse găsite" counter displays total count

---

### Test Scenario 2.2: Filter Products by Family

**Priority**: Critical

**Estimated Time**: 3 minutes


**Given**: User is on the catalog page (/catalog)

**When**: User clicks on the "Familie" accordion in the filter panel

**Then**:
- [ ] Filter section expands
- [ ] Six checkboxes are visible:
  - Profile Metalice
  - Table de Oțel
  - Țevi și Tuburi
  - Elemente de Asamblare
  - Oțel Inoxidabil
  - Metale Neferoase


**When**: User checks "Profile Metalice" checkbox

**Then**:
- [ ] Product grid updates to show only profiles
- [ ] URL updates to include ?family=profiles
- [ ] Filter chip appears below sort dropdown showing "Familie: Profile Metalice"
- [ ] Product count updates to show filtered total
- [ ] Page resets to page 1


**When**: User additionally checks "Table de Oțel"

**Then**:
- [ ] Product grid shows both profiles and plates
- [ ] URL updates to ?family=profiles,plates
- [ ] Two filter chips appear
- [ ] Product count increases


**When**: User clicks X on "Profile Metalice" filter chip

**Then**:
- [ ] Checkbox unchecks automatically
- [ ] Product grid shows only plates
- [ ] URL updates to ?family=plates
- [ ] One filter chip remains

---

### Test Scenario 2.3: Filter Products by Grade

**Priority**: High

**Estimated Time**: 3 minutes


**Given**: User is on the catalog page with no filters applied

**When**: User clicks on "Grad" accordion in filter panel

**Then**:
- [ ] Grade filter section expands
- [ ] List of available grades is displayed (e.g., S235JR, S355JR, DC01, etc.)


**When**: User checks "S235JR" checkbox

**Then**:
- [ ] Products are filtered to show only S235JR grade
- [ ] URL updates to include ?grade=S235JR
- [ ] Filter chip displays "Grad: S235JR"
- [ ] Product count updates


**When**: User checks "S355JR" additionally

**Then**:
- [ ] Products show both grades
- [ ] URL updates to ?grade=S235JR,S355JR
- [ ] Two grade filter chips appear

---

### Test Scenario 2.4: Filter Products by Standard

**Priority**: High

**Estimated Time**: 3 minutes


**Given**: User is on the catalog page

**When**: User clicks on "Standard" accordion in filter panel

**Then**:
- [ ] Standard filter section expands
- [ ] List of standards is visible (e.g., EN 10025, EN 10210, DIN, ISO, etc.)


**When**: User checks "EN 10025" checkbox

**Then**:
- [ ] Products are filtered to those conforming to EN 10025
- [ ] URL updates to include ?standard=EN 10025
- [ ] Filter chip displays "Standard: EN 10025"

---

### Test Scenario 2.5: Filter Products by Availability

**Priority**: Medium

**Estimated Time**: 2 minutes


**Given**: User is on the catalog page

**When**: User clicks on "Disponibilitate" accordion

**Then**:
- [ ] Three checkboxes are visible:
  - În Stoc
  - La Comandă
  - Indisponibil


**When**: User checks "În Stoc"

**Then**:
- [ ] Only in-stock products are displayed
- [ ] URL updates to include ?availability=in_stock
- [ ] Filter chip shows "Disponibilitate: În Stoc"
- [ ] Product availability badges all show "În Stoc"

---

### Test Scenario 2.6: Apply Multiple Filters Simultaneously

**Priority**: Critical

**Estimated Time**: 4 minutes


**Given**: User is on the catalog page

**When**: User applies the following filters:
- Family: Profile Metalice
- Grade: S235JR
- Availability: În Stoc

**Then**:
- [ ] Product grid shows only profiles that are S235JR and in stock
- [ ] URL contains all parameters: ?family=profiles&grade=S235JR&availability=in_stock
- [ ] Three filter chips are visible
- [ ] Product count reflects the intersection of all filters


**When**: User clicks "Șterge tot" (Clear All) button

**Then**:
- [ ] All filters are cleared
- [ ] All checkboxes are unchecked
- [ ] All filter chips disappear
- [ ] URL resets to /catalog with no query params
- [ ] All products are displayed again

---

### Test Scenario 2.7: Sort Products

**Priority**: High

**Estimated Time**: 4 minutes


**Given**: User is on the catalog page with products displayed

**When**: User clicks on the "Sortează după" dropdown

**Then**:
- [ ] Dropdown opens showing 7 options:
  - Implicit
  - Nume (A-Z)
  - Nume (Z-A)
  - Preț (Crescător)
  - Preț (Descrescător)
  - Disponibilitate
  - Cele mai noi


**When**: User selects "Nume (A-Z)"

**Then**:
- [ ] Products reorder alphabetically A-Z
- [ ] URL updates to include ?sort=title-asc
- [ ] First product starts with letter closer to 'A'
- [ ] Last product starts with letter closer to 'Z'


**When**: User selects "Preț (Crescător)"

**Then**:
- [ ] Products reorder by price, lowest first
- [ ] URL updates to ?sort=price-asc
- [ ] First product has the lowest price
- [ ] Last product has the highest price


**When**: User selects "Cele mai noi"

**Then**:
- [ ] Products reorder by creation date, newest first
- [ ] URL updates to ?sort=createdAt-desc

---

### Test Scenario 2.8: Pagination

**Priority**: Critical

**Estimated Time**: 5 minutes


**Given**: User is on the catalog page with more than 12 products

**When**: User scrolls to the bottom of the page

**Then**:
- [ ] Pagination controls are visible
- [ ] Page numbers are displayed (1, 2, 3, ... or with ellipsis)
- [ ] Current page is highlighted
- [ ] "Previous" button is disabled on page 1
- [ ] "Next" button is enabled if more pages exist
- [ ] "Items per page" dropdown shows current value (default: 12)


**When**: User clicks page "2"

**Then**:
- [ ] Page scrolls to top
- [ ] New set of products loads (items 13-24)
- [ ] URL updates to include ?page=2
- [ ] Page 2 is now highlighted
- [ ] "Previous" button is now enabled


**When**: User clicks "Next" button

**Then**:
- [ ] Advances to page 3
- [ ] URL updates to ?page=3
- [ ] Products 25-36 are displayed


**When**: User clicks "First" button

**Then**:
- [ ] Returns to page 1
- [ ] URL updates to ?page=1 or removes page param
- [ ] First 12 products are displayed


**When**: User clicks "Last" button

**Then**:
- [ ] Navigates to the last page
- [ ] "Next" button is disabled
- [ ] Remaining products are displayed


**When**: User changes "Items per page" to 24

**Then**:
- [ ] Product grid shows 24 products
- [ ] URL updates to include ?limit=24
- [ ] Page resets to page 1
- [ ] Total page count decreases

---

### Test Scenario 2.9: Breadcrumb Navigation

**Priority**: Medium

**Estimated Time**: 3 minutes


**Given**: User is on a category page (e.g., /catalog/profiles)

**When**: User looks at the breadcrumb

**Then**:
- [ ] Breadcrumb displays: Home → Catalog → Profile Metalice
- [ ] "Profile Metalice" is not a link (current page)
- [ ] "Catalog" is a clickable link
- [ ] "Home" is a clickable link with house icon


**When**: User clicks "Catalog" in breadcrumb

**Then**:
- [ ] Browser navigates to /catalog
- [ ] All product families are shown
- [ ] Family filter is cleared


**When**: User clicks "Home" in breadcrumb

**Then**:
- [ ] Browser navigates to home page (/)

---

### Test Scenario 2.10: Search Functionality - Basic Search

**Priority**: Critical

**Estimated Time**: 4 minutes


**Given**: User is on any page with the header visible

**When**: User clicks on the search input in the header

**Then**:
- [ ] Input receives focus
- [ ] Cursor appears in the search field
- [ ] Placeholder text reads: "Caută profile, table, țevi... (ex: HEA 200, S235JR)"


**When**: User types "S235"

**Then**:
- [ ] Text appears in input field
- [ ] After 300ms delay, search results dropdown appears below input
- [ ] Loading spinner appears briefly during search


**When**: Search completes

**Then**:
- [ ] Dropdown shows grouped results:
  - Categories section (if any match)
  - Products section with count
- [ ] Each product result shows:
  - Product name
  - SKU
  - Grade
  - Standard (first one)
  - Price (if available)

---

### Test Scenario 2.11: Search Functionality - Autocomplete Interaction

**Priority**: High

**Estimated Time**: 4 minutes


**Given**: User has typed "HEA" in the search box

**When**: Search results dropdown is displayed

**Then**:
- [ ] Multiple products matching "HEA" are shown
- [ ] Each result is clickable/hoverable


**When**: User hovers over a product result

**Then**:
- [ ] Result row highlights with background color change
- [ ] Cursor changes to pointer


**When**: User clicks on a product result

**Then**:
- [ ] Browser navigates to catalog with search query: /catalog?search=HEA
- [ ] Product grid filters to show matching products
- [ ] Search dropdown closes
- [ ] Search input remains populated with "HEA"


**When**: User clicks outside the search dropdown

**Then**:
- [ ] Dropdown closes
- [ ] Search input retains the typed value


**When**: User presses Escape key while dropdown is open

**Then**:
- [ ] Dropdown closes immediately
- [ ] Search input loses focus

---

### Test Scenario 2.12: Search Functionality - Clear Search

**Priority**: Medium

**Estimated Time**: 2 minutes


**Given**: User has typed "S235JR" in the search box

**When**: User looks at the search input

**Then**:
- [ ] "X" (clear) button is visible on the right side of input


**When**: User clicks the clear button

**Then**:
- [ ] Search input is cleared
- [ ] Dropdown closes
- [ ] Focus returns to search input
- [ ] Clear button disappears

---

### Test Scenario 2.13: Search Functionality - Enter Key Navigation

**Priority**: High

**Estimated Time**: 2 minutes


**Given**: User has typed "IPE 200" in the search box

**When**: User presses Enter key

**Then**:
- [ ] Browser navigates to /catalog?search=IPE+200
- [ ] Catalog page displays products matching "IPE 200"
- [ ] Search dropdown closes
- [ ] Filter chips show search query

---

### Test Scenario 2.14: Search Functionality - No Results

**Priority**: Medium

**Estimated Time**: 2 minutes


**Given**: User is on any page

**When**: User types "XYZABC12345" (invalid search query)

**Then**:
- [ ] After debounce delay, search dropdown appears
- [ ] Dropdown displays message: "Nu am găsit rezultate pentru 'XYZABC12345'"
- [ ] No product or category results are shown

---

### Test Scenario 2.15: Search Functionality - Category Results

**Priority**: Medium

**Estimated Time**: 3 minutes


**Given**: User types "profile" in search

**When**: Results dropdown appears

**Then**:
- [ ] "Categorii" section appears at the top
- [ ] "Profile Metalice" category is shown with description
- [ ] Category has folder icon
- [ ] Arrow icon appears on the right


**When**: User clicks on the category result

**Then**:
- [ ] Browser navigates to /catalog/profiles
- [ ] Category page loads with products filtered to profiles
- [ ] Search dropdown closes

---

### Test Scenario 2.16: Category Page - Automatic Filtering

**Priority**: Critical

**Estimated Time**: 3 minutes


**Given**: User navigates to /catalog/profiles directly

**When**: Page loads

**Then**:
- [ ] Hero section displays "Profile Metalice"
- [ ] Description shows: "Profile metalice de înaltă calitate: HEA, UNP, IPE, UPN..."
- [ ] Breadcrumb shows: Home → Catalog → Profile Metalice
- [ ] Product grid shows ONLY profile products
- [ ] URL shows: /catalog/profiles (no query params needed)
- [ ] Filter panel shows category-specific options:
  - Grades available for profiles only
  - Standards available for profiles only


**When**: User checks additional filters (e.g., Grade: S235JR)

**Then**:
- [ ] URL updates to /catalog/profiles?grade=S235JR
- [ ] Products are filtered to profiles AND S235JR grade
- [ ] Family filter is implicitly applied (not shown in URL)

---

### Test Scenario 2.17: Category Page - All Categories Test

**Priority**: High

**Estimated Time**: 10 minutes

**Test each category page**: profiles, plates, pipes, fasteners, stainless, nonferrous

**For each category**:


**Given**: User navigates to category page

**When**: Page loads

**Then**:
- [ ] Correct hero title is displayed
- [ ] Correct description is displayed
- [ ] Only products from that family are shown
- [ ] Filter options are specific to that family
- [ ] Breadcrumb shows correct category name

**Category-specific checks**:

| Family | URL | Hero Title | Products Should Include |
|--------|-----|------------|------------------------|
| profiles | /catalog/profiles | Profile Metalice | HEA, UNP, IPE, UPN |
| plates | /catalog/plates | Table de Oțel | DC01, S235JR, S355JR |
| pipes | /catalog/pipes | Țevi și Tuburi | Rectangular, Round pipes |
| fasteners | /catalog/fasteners | Elemente de Asamblare | Screws, nuts, bolts |
| stainless | /catalog/stainless | Oțel Inoxidabil | 304, 316L, 321 |
| nonferrous | /catalog/nonferrous | Metale Neferoase | Aluminum, Copper, Bronze |

---

### Test Scenario 2.18: URL State Persistence

**Priority**: High

**Estimated Time**: 5 minutes


**Given**: User applies multiple filters and sorts on catalog page

**When**: User applies:
- Family: Profile Metalice
- Grade: S235JR
- Sort: Preț (Crescător)
- Page: 2


**Then**:
- [ ] URL becomes: /catalog?family=profiles&grade=S235JR&sort=price-asc&page=2


**When**: User copies the URL and pastes it in a new browser tab

**Then**:
- [ ] Page loads with all filters applied
- [ ] Product grid shows page 2
- [ ] Products are sorted by price ascending
- [ ] Filter chips show all active filters
- [ ] Checkboxes are checked appropriately


**When**: User clicks browser back button

**Then**:
- [ ] Previous filter state is restored
- [ ] URL updates accordingly
- [ ] Product grid reflects previous state


**When**: User clicks browser forward button

**Then**:
- [ ] Returns to the state before going back
- [ ] All filters and sorting are restored

---

### Test Scenario 2.19: Product Grid Display

**Priority**: High

**Estimated Time**: 3 minutes


**Given**: User is on catalog page with products displayed

**When**: User examines the product grid

**Then**: Each product card should display:
- [ ] Product image (or placeholder)
- [ ] Product title (e.g., "Profil HEA 200")
- [ ] SKU code
- [ ] Grade (e.g., S235JR)
- [ ] Availability badge (În Stoc / La Comandă / Indisponibil)
- [ ] Price information (if available) with unit (e.g., "de la 45.50 RON/kg")
- [ ] Standards (if visible in design)


**When**: User hovers over a product card

**Then**:
- [ ] Card has hover effect (shadow, border, or transform)
- [ ] Cursor changes to pointer

---

### Test Scenario 2.20: Loading States

**Priority**: Medium

**Estimated Time**: 3 minutes


**Given**: User navigates to catalog page

**When**: Products are loading

**Then**:
- [ ] Skeleton loaders are displayed in product grid
- [ ] Skeleton cards have shimmer/pulse animation
- [ ] Layout structure is maintained (same grid)


**When**: Products finish loading

**Then**:
- [ ] Skeletons are replaced with actual product cards
- [ ] No layout shift occurs
- [ ] All product data is visible


**Given**: User performs a search

**When**: Search is in progress

**Then**:
- [ ] Loading spinner appears in search input
- [ ] Clear button is replaced temporarily with spinner


**When**: Search completes

**Then**:
- [ ] Spinner disappears
- [ ] Results are displayed

---

### Test Scenario 2.21: Filter Panel Responsiveness

**Priority**: Medium

**Estimated Time**: 4 minutes


**Given**: User is on catalog page

**When**: User views on desktop (>1024px)

**Then**:
- [ ] Filter panel is visible on left side
- [ ] Takes up ~1/4 of screen width
- [ ] Product grid takes up ~3/4 of screen width


**When**: User views on tablet (768px-1023px)

**Then**:
- [ ] Filter panel remains visible OR collapses to drawer
- [ ] Product grid adjusts to 2 columns


**When**: User views on mobile (<768px)

**Then**:
- [ ] Filter panel collapses into a drawer/modal
- [ ] "Filter" button appears to open drawer
- [ ] Product grid shows 1 column

---

### Test Scenario 2.22: Combined Filter and Sort Interaction

**Priority**: High

**Estimated Time**: 4 minutes


**Given**: User is on catalog page

**When**: User applies filter: Family = "Profile Metalice"

**Then**:
- [ ] Products are filtered to profiles only


**When**: User then sorts by "Preț (Crescător)"

**Then**:
- [ ] Filtered products (profiles only) are sorted by price ascending
- [ ] URL includes both: ?family=profiles&sort=price-asc
- [ ] First product is the cheapest profile
- [ ] Filter and sort work together correctly


**When**: User changes to page 2

**Then**:
- [ ] URL includes: ?family=profiles&sort=price-asc&page=2
- [ ] Next set of sorted, filtered products appears
- [ ] Filter chips remain visible
- [ ] Sort dropdown retains selected value

---

## Phase 3: Product Detail Page (PDP) & Configuration

### Test Scenario 3.1: Navigate to Product Detail Page

**Priority**: Critical

**Estimated Time**: 3 minutes


**Given**: User is on the catalog page (/catalog)

**When**: User clicks on a product card (e.g., "Profil HEA 200 S235JR EN 10025")

**Then**:
- [ ] Browser navigates to /product/{slug}
- [ ] URL updates (e.g., /product/profil-hea-200-s235jr-en-10025)
- [ ] Product detail page loads within 2 seconds
- [ ] No console errors appear

---

### Test Scenario 3.2: PDP Hero Section Display

**Priority**: Critical

**Estimated Time**: 3 minutes


**Given**: User is on a product detail page

**When**: Page loads

**Then**:
- [ ] Breadcrumb displays: Home → Catalog → {Family} → {Product Title}
- [ ] Product image or placeholder icon is visible (centered, min 400px height)
- [ ] Product title is displayed prominently (e.g., "Profil HEA 200 S235JR EN 10025")
- [ ] SKU is displayed with monospace font
- [ ] Producer name is shown (if available)
- [ ] Availability badge is visible with correct color:
  - Green background: "În Stoc"
  - Orange background: "La Comandă"
  - Gray background: "Indisponibil"
- [ ] Grade badges are displayed (e.g., "Grad: S235JR")
- [ ] Standard badges are shown (up to 2 standards)
- [ ] Indicative price is displayed: "de la {price} RON/{unit}"
- [ ] Price unit is correct (kg, m, pcs, etc.)

---

### Test Scenario 3.3: Specification Table Display

**Priority**: High

**Estimated Time**: 4 minutes


**Given**: User is on a product detail page

**When**: User scrolls to the specifications section

**Then**:
- [ ] "Specificații Tehnice" card is visible
- [ ] "Descarcă Fișă Tehnică (PDF)" button is present
- [ ] Dimensions section shows correct values:
  - Height (if applicable)
  - Width (if applicable)
  - Thickness (if applicable)
  - Diameter (if applicable)
  - Length (if applicable)
- [ ] Material grade is displayed
- [ ] Producer is shown (if available)
- [ ] Chemical composition table is displayed with elements and percentages
- [ ] Mechanical properties section shows:
  - Yield strength (MPa)
  - Tensile strength (MPa)
  - Elongation (%)
- [ ] Standards compliance badges are visible
- [ ] Tolerances section shows dimensional tolerances
- [ ] Surface finish options are listed


**When**: User clicks "Descarcă Fișă Tehnică (PDF)" button

**Then**:
- [ ] Console logs download action (in production, would trigger PDF download)
- [ ] No errors occur

---

### Test Scenario 3.4: Configuration Panel - Selling Unit Selection

**Priority**: Critical

**Estimated Time**: 4 minutes


**Given**: User is on a product detail page

**When**: User looks at the "Configurație Produs" panel

**Then**:
- [ ] "Unitate de vânzare" section is visible
- [ ] Four radio button options are available:
  - Metri (m)
  - Kilograme (kg)
  - Bucăți (buc)
  - Pachet
- [ ] "Metri (m)" is selected by default


**When**: User clicks "Kilograme (kg)" radio button

**Then**:
- [ ] Radio button selection changes to "kg"
- [ ] Length options section disappears (not applicable for kg)
- [ ] Cut to length toggle disappears
- [ ] Weight estimator updates immediately (< 150ms)
- [ ] Price estimator updates immediately (< 150ms)
- [ ] Quantity input shows "kg" unit label


**When**: User switches back to "Metri (m)"

**Then**:
- [ ] Length options section reappears
- [ ] Cut to length toggle reappears
- [ ] Weight and price recalculate correctly
- [ ] Quantity input shows "m" unit label

---

### Test Scenario 3.5: Configuration Panel - Length Options

**Priority**: High

**Estimated Time**: 4 minutes


**Given**: User has "Metri (m)" selected as selling unit

**When**: User clicks the "Lungime" dropdown

**Then**:
- [ ] Dropdown opens showing three options:
  - 6 metri (standard)
  - 12 metri
  - Lungime personalizată
- [ ] "6 metri (standard)" is selected by default


**When**: User selects "12 metri"

**Then**:
- [ ] Dropdown value changes to "12 metri"
- [ ] Weight estimate updates based on 12m length
- [ ] Price estimate updates accordingly
- [ ] No custom length input appears


**When**: User selects "Lungime personalizată"

**Then**:
- [ ] Custom length input field appears below dropdown
- [ ] Input has placeholder: "Introduceți lungimea (m)"
- [ ] Input accepts decimal values (step="0.1")
- [ ] Helper text shows: "Lungime maximă: 12 metri"


**When**: User enters "8.5" in custom length input

**Then**:
- [ ] Input accepts the value
- [ ] Weight estimate updates to reflect 8.5m length
- [ ] Price estimate updates accordingly
- [ ] Updates occur in < 150ms


**When**: User enters "15" (exceeds maximum)

**Then**:
- [ ] Input validation prevents or warns about exceeding max (implementation dependent)
- [ ] Value is capped at 12 or validation error appears

---

### Test Scenario 3.6: Configuration Panel - Quantity Input

**Priority**: Critical

**Estimated Time**: 3 minutes


**Given**: User is on product detail page with configuration panel visible

**When**: User looks at the "Cantitate" field

**Then**:
- [ ] Number input is visible
- [ ] Default value is 1
- [ ] Unit label displays current selling unit (e.g., "m", "kg", "pcs")


**When**: User changes quantity to "10"

**Then**:
- [ ] Input accepts the value
- [ ] Weight estimate multiplies by 10
- [ ] Price estimate multiplies by 10
- [ ] Updates occur in < 150ms
- [ ] Total weight shows correct calculation


**When**: User tries to enter "0" or negative number

**Then**:
- [ ] Input validation prevents entry (min="1")
- [ ] Or value resets to 1

---

### Test Scenario 3.7: Configuration Panel - Finish Selection

**Priority**: High

**Estimated Time**: 4 minutes


**Given**: User is on product detail page

**When**: User clicks the "Finisaj suprafață" dropdown

**Then**:
- [ ] Dropdown opens showing four options:
  - Standard (laminat la cald)
  - Zincat (+15%)
  - Vopsit (+20%)
  - Lustruit (+30%)
- [ ] "Standard (laminat la cald)" is selected by default
- [ ] Price adjustments are shown in parentheses


**When**: User selects "Zincat (+15%)"

**Then**:
- [ ] Dropdown value changes to "Zincat (+15%)"
- [ ] Price estimate increases by 15%
- [ ] Price breakdown shows finish adjustment
- [ ] Weight estimate remains unchanged
- [ ] Update occurs in < 150ms


**When**: User selects "Lustruit (+30%)"

**Then**:
- [ ] Price estimate increases by 30% from base price
- [ ] Price breakdown clearly shows the adjustment
- [ ] Total price reflects the finish multiplier

---

### Test Scenario 3.8: Cut to Length Toggle

**Priority**: High

**Estimated Time**: 3 minutes


**Given**: User has "Metri (m)" selected as selling unit

**When**: User looks at the bottom of configuration panel

**Then**:
- [ ] "Debitare la dimensiune" section is visible
- [ ] Label reads: "Debitare la dimensiune"
- [ ] Helper text shows: "Specificați lungimi personalizate pentru debitare"
- [ ] Toggle switch is present
- [ ] Toggle is OFF by default


**When**: User clicks the toggle switch to turn it ON

**Then**:
- [ ] Toggle switches to ON state
- [ ] "Listă Debitări" card appears below configuration panel
- [ ] Cut list editor is now visible


**When**: User clicks toggle to turn it OFF

**Then**:
- [ ] Toggle switches to OFF state
- [ ] "Listă Debitări" card disappears
- [ ] Weight and price estimates revert to standard calculation (without cut list)

---

### Test Scenario 3.9: Cut List Editor - Add Items

**Priority**: Critical

**Estimated Time**: 5 minutes


**Given**: User has enabled "Debitare la dimensiune" toggle

**When**: User looks at the "Listă Debitări" card

**Then**:
- [ ] Card header shows "Listă Debitări"
- [ ] "Export CSV", "Import CSV", buttons are visible
- [ ] Two input fields are visible:
  - "Lungime (m)" - number input
  - "Cantitate (buc)" - number input
- [ ] "Adaugă" button with plus icon is visible
- [ ] Empty state message shows: "Nu există elemente în lista de debitări"


**When**: User enters "2.5" in length and "10" in quantity

**Then**:
- [ ] Both inputs accept the values


**When**: User clicks "Adaugă" button

**Then**:
- [ ] New row appears in the cut list table
- [ ] Row shows: Length = 2.5, Quantity = 10, Total = 25.0 m
- [ ] Input fields are cleared
- [ ] Focus returns to length input (for quick entry)
- [ ] Empty state message disappears
- [ ] Summary section appears at bottom


**When**: User presses Enter key after filling inputs

**Then**:
- [ ] Item is added to cut list (same as clicking button)
- [ ] Inputs are cleared


**When**: User adds more items:
- 3.2m × 5 pieces
- 1.8m × 15 pieces

**Then**:
- [ ] All items appear in the table
- [ ] Summary shows:
  - Total bucăți: 30 buc (10 + 5 + 15)
  - Total lungime: 68.0 m (25.0 + 16.0 + 27.0)
  - Deșeuri estimate: X%

---

### Test Scenario 3.10: Cut List Editor - Edit and Remove Items

**Priority**: High

**Estimated Time**: 4 minutes


**Given**: User has added 3 items to cut list

**When**: User clicks in the length input of an existing row

**Then**:
- [ ] Input becomes editable
- [ ] Current value is highlighted


**When**: User changes length from "2.5" to "3.0"

**Then**:
- [ ] Value updates
- [ ] Total column recalculates: 3.0 × 10 = 30.0 m
- [ ] Summary totals update
- [ ] Waste percentage recalculates
- [ ] Weight estimate updates
- [ ] Price estimate updates
- [ ] Updates occur in < 150ms


**When**: User clicks the trash icon on a row

**Then**:
- [ ] Row is removed from the table
- [ ] Summary totals update
- [ ] Waste percentage recalculates
- [ ] If last item removed, empty state reappears


**When**: User clicks "Șterge tot" button (if multiple items exist)

**Then**:
- [ ] All items are removed
- [ ] Table is cleared
- [ ] Empty state message reappears
- [ ] Summary section disappears
- [ ] Weight and price estimates reset to standard calculation

---

### Test Scenario 3.11: Cut List Editor - Waste Calculation

**Priority**: High

**Estimated Time**: 5 minutes


**Given**: User has cut to length enabled with 6m stock length selected

**When**: User adds optimal cuts:
- 6.0m × 5 pieces

**Then**:
- [ ] Waste percentage shows: 0.0%
- [ ] No warning is displayed


**When**: User adds inefficient cuts that create waste:
- 2.0m × 10 pieces
- 1.5m × 8 pieces

**Then**:
- [ ] Waste percentage calculates correctly
- [ ] If waste > 15%, warning text appears in orange:
  - "Atenție: Procentul de deșeuri este ridicat. Considerați optimizarea listei de debitări."
- [ ] Waste percentage value displays in orange color


**Calculation verification**:
- Total cut length: (2.0 × 10) + (1.5 × 8) = 20 + 12 = 32m
- Stock needed: 6 bars × 6m = 36m
- Waste: 36 - 32 = 4m
- Waste %: (4 / 36) × 100 = 11.11%

**Then**:
- [ ] Waste percentage displays approximately 11.1%

---

### Test Scenario 3.12: Cut List Editor - CSV Export

**Priority**: Medium

**Estimated Time**: 3 minutes


**Given**: User has added multiple items to cut list:
- 2.5m × 10
- 3.2m × 5
- 1.8m × 15

**When**: User clicks "Export CSV" button

**Then**:
- [ ] Browser triggers file download
- [ ] Downloaded file name format: `cut-list-{timestamp}.csv`
- [ ] File contains header row: "Lungime (m),Cantitate (buc)"
- [ ] File contains data rows:
  ```
  2.5,10
  3.2,5
  1.8,15
  ```
- [ ] CSV is properly formatted and can be opened in Excel/Sheets

---

### Test Scenario 3.13: Cut List Editor - CSV Import

**Priority**: Medium

**Estimated Time**: 4 minutes


**Given**: User has a CSV file with cut list data:
```csv
Lungime (m),Cantitate (buc)
2.5,10
3.0,8
1.5,20
```

**When**: User clicks "Import CSV" button

**Then**:
- [ ] File picker dialog opens
- [ ] Only .csv files are selectable (accept=".csv")


**When**: User selects the CSV file

**Then**:
- [ ] File is parsed
- [ ] All valid rows are added to the cut list table
- [ ] Summary updates with imported items
- [ ] Weight and price estimates update
- [ ] File input is reset (can import again)


**When**: User imports a CSV with invalid data:
```csv
Lungime (m),Cantitate (buc)
invalid,10
3.0,abc
```

**Then**:
- [ ] Invalid rows are skipped gracefully
- [ ] Valid rows are still imported
- [ ] No JavaScript errors occur

---

### Test Scenario 3.14: Weight Estimator Display

**Priority**: Critical

**Estimated Time**: 4 minutes


**Given**: User is on a product detail page (e.g., HEA 200 profile)

**When**: User looks at the "Estimare Greutate" card in the sidebar

**Then**:
- [ ] Card title shows "Estimare Greutate"
- [ ] Large number displays total weight (e.g., "105.00")
- [ ] Unit "kg" is shown next to the number
- [ ] Formula section at bottom shows calculation method
- [ ] Example: "Greutate = Lungime × Greutate specifică (10.5 kg/m)"


**When**: User changes quantity from 1 to 10

**Then**:
- [ ] Total weight multiplies by 10
- [ ] Display updates in < 150ms
- [ ] Formula remains visible


**When**: User enables cut to length and adds items:
- 2.5m × 10 pieces
- 3.0m × 5 pieces

**Then**:
- [ ] Weight calculates based on total cut length (2.5×10 + 3.0×5 = 40m)
- [ ] Formula updates to reflect cut list calculation
- [ ] Weight shows: 40m × 10.5 kg/m = 420.00 kg
- [ ] Update occurs in < 150ms

---

### Test Scenario 3.15: Price Estimator Display

**Priority**: Critical

**Estimated Time**: 4 minutes


**Given**: User is on a product detail page

**When**: User looks at the "Estimare Preț" card

**Then**:
- [ ] Card title shows "Estimare Preț"
- [ ] Price breakdown is displayed:
  - Preț unitar: X RON/{unit}
  - Subtotal: X RON
  - TVA (19%): X RON
  - Livrare (estimată): X RON
  - Total: X RON (large, bold)
- [ ] Disclaimer alert is visible at bottom:
  - Orange/yellow background
  - AlertCircle icon
  - Bold text: "Notă importantă:"
  - Message about indicative prices


**When**: User changes finish to "Zincat (+15%)"

**Then**:
- [ ] Unit price increases by 15%
- [ ] Subtotal recalculates
- [ ] TVA recalculates (19% of new subtotal)
- [ ] Total updates
- [ ] All updates occur in < 150ms


**When**: User changes quantity to 100

**Then**:
- [ ] Subtotal = unit price × 100
- [ ] TVA = 19% of subtotal
- [ ] Delivery fee may change based on weight
- [ ] Total updates correctly

---

### Test Scenario 3.16: Delivery Information Display

**Priority**: High

**Estimated Time**: 3 minutes


**Given**: User is on a product detail page with "În Stoc" availability

**When**: User looks at delivery information section

**Then**:
- [ ] Delivery window shows: "3-5 zile lucrătoare"
- [ ] Estimated delivery date is calculated from today + 3-5 days
- [ ] Clock icon is visible
- [ ] Delivery fee band information is shown


**When**: Product availability is "La Comandă"

**Then**:
- [ ] Delivery window shows: "7-14 zile lucrătoare"
- [ ] Estimated date reflects longer window


**When**: Product availability is "Indisponibil"

**Then**:
- [ ] Delivery window shows: "Se confirmă la comandă"
- [ ] No specific date estimate is shown


**When**: Total weight exceeds 1000kg

**Then**:
- [ ] Special transport warning appears
- [ ] Alert shows: "Transport special necesar - se confirmă după comandă"
- [ ] Warning has distinct styling (orange/yellow)

---

### Test Scenario 3.17: Add to Estimate Button

**Priority**: Critical

**Estimated Time**: 3 minutes


**Given**: User has configured a product:
- Selling unit: Metri
- Length: 6m
- Quantity: 10
- Finish: Standard

**When**: User looks at the "Adaugă la Estimare" button

**Then**:
- [ ] Button is visible in sidebar
- [ ] Button is enabled (not disabled)
- [ ] Button shows shopping cart icon
- [ ] Button text reads "Adaugă la Estimare"


**When**: User clicks the button

**Then**:
- [ ] Console logs estimate data (in production, would add to cart)
- [ ] Alert shows: "Adăugat la estimare: {Product Title}"
- [ ] No errors occur


**When**: Configuration is invalid (e.g., quantity = 0 or custom length empty)

**Then**:
- [ ] Button becomes disabled
- [ ] Button has reduced opacity or disabled styling
- [ ] Clicking does nothing

---

### Test Scenario 3.18: Real-Time Calculation Performance

**Priority**: High

**Estimated Time**: 5 minutes


**Given**: User is on product detail page with browser DevTools performance panel open

**When**: User rapidly changes configuration:
1. Change quantity from 1 to 50
2. Change finish to "Lustruit (+30%)"
3. Enable cut to length
4. Add 5 items to cut list quickly

**Then**: For each change:
- [ ] Weight estimate updates in < 150ms
- [ ] Price estimate updates in < 150ms
- [ ] No UI lag or jank
- [ ] No console warnings about excessive re-renders
- [ ] Calculations are accurate


**When**: User adds 20 items to cut list

**Then**:
- [ ] Table remains performant
- [ ] Scrolling is smooth
- [ ] Waste calculation completes quickly
- [ ] No performance degradation

---

### Test Scenario 3.19: PDP Responsive Design - Mobile

**Priority**: High

**Estimated Time**: 5 minutes


**Given**: User is on product detail page

**When**: User resizes browser to mobile width (375px)

**Then**:
- [ ] Product image/icon stacks above product info
- [ ] Configuration panel stacks below product info
- [ ] Estimators (weight, price) stack vertically
- [ ] "Adaugă la Estimare" button remains accessible
- [ ] Cut list table scrolls horizontally if needed
- [ ] All text remains readable
- [ ] Touch targets are adequately sized (min 44×44px)


**When**: User resizes to tablet width (768px)

**Then**:
- [ ] Layout adjusts to 2-column on some sections
- [ ] Configuration and estimators may side-by-side
- [ ] Spec table remains readable


**When**: User resizes to desktop width (1280px)

**Then**:
- [ ] 3-column layout: Configuration (2/3) + Estimators sidebar (1/3)
- [ ] Product hero is 2-column: image + info
- [ ] All elements have proper spacing

---

### Test Scenario 3.20: PDP Loading States

**Priority**: Medium

**Estimated Time**: 3 minutes


**Given**: User clicks on a product card from catalog

**When**: Navigation to PDP starts

**Then**:
- [ ] Loading state appears immediately
- [ ] Skeleton loaders or spinner is visible
- [ ] Page structure is maintained (no layout shift)
- [ ] Loading message shows: "Se încarcă produsul..."


**When**: Product data loads successfully

**Then**:
- [ ] Loading state disappears
- [ ] Product information populates
- [ ] No layout shift occurs
- [ ] All interactive elements become functional


**When**: Product fetch fails (simulate with invalid slug)

**Then**:
- [ ] Error state appears
- [ ] Message shows: "Produs negăsit"
- [ ] Description: "Produsul pe care îl căutați nu există sau a fost șters."
- [ ] "Înapoi la catalog" button is visible and functional

---

### Test Scenario 3.21: PDP Breadcrumb Navigation

**Priority**: Medium

**Estimated Time**: 3 minutes


**Given**: User is on product detail page for a profile product

**When**: User looks at breadcrumb

**Then**:
- [ ] Breadcrumb shows: Home → Catalog → Profile Metalice → {Product Title}
- [ ] "Home" is clickable with house icon
- [ ] "Catalog" is clickable
- [ ] "Profile Metalice" is clickable
- [ ] Product title is not clickable (current page)


**When**: User clicks "Profile Metalice" in breadcrumb

**Then**:
- [ ] Browser navigates to /catalog/profiles
- [ ] Category page loads with profiles filtered


**When**: User clicks "Catalog" in breadcrumb

**Then**:
- [ ] Browser navigates to /catalog
- [ ] All products are shown


**When**: User clicks "Home" in breadcrumb

**Then**:
- [ ] Browser navigates to home page (/)

---

### Test Scenario 3.22: PDP Back to Catalog Navigation

**Priority**: Medium

**Estimated Time**: 2 minutes


**Given**: User is on product detail page

**When**: User scrolls to the sidebar

**Then**:
- [ ] "Înapoi la catalog" button is visible below "Adaugă la Estimare"
- [ ] Button has outline variant styling
- [ ] Button shows ArrowLeft icon


**When**: User clicks "Înapoi la catalog" button

**Then**:
- [ ] Browser navigates to /catalog
- [ ] Catalog page loads
- [ ] Any previous filters are preserved (if browser history supports it)

---

### Test Scenario 3.23: PDP Related Products Section

**Priority**: Low

**Estimated Time**: 2 minutes


**Given**: User is on product detail page

**When**: User scrolls to the bottom of the page

**Then**:
- [ ] "Produse similare" section is visible
- [ ] Section has light background (muted/30)
- [ ] Placeholder text shows: "Secțiunea pentru produse similare va fi implementată în curând"
- [ ] No errors occur

**Note**: This is a placeholder for future implementation

---

### Test Scenario 3.24: PDP URL Direct Access

**Priority**: High

**Estimated Time**: 3 minutes


**Given**: User has a product URL: /product/profil-hea-200-s235jr-en-10025

**When**: User pastes URL directly in browser and presses Enter

**Then**:
- [ ] Page loads correctly
- [ ] Product data fetches based on slug parameter
- [ ] All sections render properly
- [ ] Configuration panel has default values
- [ ] Estimators show default calculations


**When**: User refreshes the page (F5 or Cmd+R)

**Then**:
- [ ] Page reloads successfully
- [ ] Product data is fetched again
- [ ] Configuration resets to defaults (expected behavior)
- [ ] No errors occur

---

### Test Scenario 3.25: PDP Multiple Configuration Changes

**Priority**: High

**Estimated Time**: 5 minutes


**Given**: User is on product detail page

**When**: User performs the following sequence:
1. Change selling unit to "kg"
2. Change quantity to 500
3. Change finish to "Vopsit (+20%)"

**Then**:
- [ ] Weight shows: 500 kg
- [ ] Price increases by 20% from base
- [ ] Length options are hidden (kg selected)
- [ ] All calculations are accurate


**When**: User switches back to "Metri (m)"
And: Sets custom length to 8.5m
And: Sets quantity to 12
And: Enables cut to length
And: Adds cuts: 2.8m × 30, 2.5m × 6

**Then**:
- [ ] Weight calculates based on cut list: (2.8×30 + 2.5×6) × unit_weight
- [ ] Price calculates for total length with finish adjustment
- [ ] Waste percentage displays correctly
- [ ] All updates happen smoothly with no errors
- [ ] Updates occur in < 150ms per change

---

### Test Scenario 3.26: PDP Accessibility - Keyboard Navigation

**Priority**: Medium

**Estimated Time**: 5 minutes


**Given**: User is on product detail page

**When**: User presses Tab key repeatedly

**Then**: Focus moves through elements in logical order:
- [ ] Breadcrumb links
- [ ] Download datasheet button
- [ ] Selling unit radio buttons
- [ ] Length dropdown
- [ ] Quantity input
- [ ] Finish dropdown
- [ ] Cut to length toggle
- [ ] Cut list inputs (if enabled)
- [ ] Add button (cut list)
- [ ] Table rows (cut list)
- [ ] Add to Estimate button
- [ ] Back to Catalog button


**When**: User uses Arrow keys on radio group

**Then**:
- [ ] Radio selection changes with arrow keys
- [ ] Configuration updates accordingly


**When**: User presses Enter on "Adaugă la Estimare" button

**Then**:
- [ ] Button action triggers
- [ ] Alert appears

---

### Test Scenario 3.27: PDP Edge Cases - Invalid Inputs

**Priority**: Medium

**Estimated Time**: 4 minutes


**Given**: User is on product detail page

**When**: User tries to enter negative quantity

**Then**:
- [ ] Input validation prevents negative values
- [ ] Or value resets to 1


**When**: User enters very large quantity (e.g., 999999)

**Then**:
- [ ] Input accepts the value
- [ ] Calculations handle large numbers correctly
- [ ] No overflow errors
- [ ] Weight and price display formatted properly


**When**: User enters non-numeric characters in cut list length

**Then**:
- [ ] Input validation prevents non-numeric entry
- [ ] Or input is sanitized to valid number


**When**: User tries to add cut list item with empty fields

**Then**:
- [ ] Validation prevents adding invalid items
- [ ] Button may be disabled
- [ ] Or form shows validation errors

---

### Test Scenario 3.28: PDP Cross-Browser Compatibility

**Priority**: High

**Estimated Time**: 15 minutes

**Test on each browser**: Chrome, Firefox, Safari, Edge

**For each browser, verify**:

**Given**: User navigates to product detail page

**Then**:
- [ ] Page renders correctly
- [ ] Configuration panel is functional
- [ ] Radio buttons, dropdowns, switches work
- [ ] Cut list editor table displays properly
- [ ] CSV export/import works
- [ ] Real-time calculations update correctly
- [ ] No browser-specific errors in console
- [ ] All interactive elements are clickable
- [ ] Responsive design works on different viewports

---

## Edge Cases & Error Scenarios

### Test Scenario 3.1: Invalid URL Parameters

**Priority**: Medium

**Estimated Time**: 3 minutes


**Given**: User manually edits URL

**When**: User navigates to /catalog?family=INVALID_FAMILY

**Then**:
- [ ] Page loads without crashing
- [ ] No products are shown OR all products are shown (depending on handling)
- [ ] No error message appears in console (or graceful error)


**When**: User navigates to /catalog?page=9999

**Then**:
- [ ] Page loads
- [ ] Empty state is shown OR redirects to last valid page
- [ ] No JavaScript errors

---

### Test Scenario 3.2: Network Failure Simulation

**Priority**: Low

**Estimated Time**: 3 minutes


**Given**: User is on catalog page

**When**: User opens browser DevTools → Network tab
**And**: User throttles network to "Offline"
**And**: User tries to filter products

**Then**:
- [ ] Graceful error message appears OR uses cached data
- [ ] Page doesn't crash
- [ ] User can retry action

---

### Test Scenario 3.3: Special Characters in Search

**Priority**: Low

**Estimated Time**: 2 minutes


**Given**: User is on any page

**When**: User types special characters in search: `<script>alert('test')</script>`

**Then**:
- [ ] No script execution occurs (XSS protection)
- [ ] Search handles gracefully
- [ ] Special characters are escaped/sanitized

---

## Performance Tests

### Test Scenario 4.1: Page Load Performance

**Priority**: Medium

**Estimated Time**: 5 minutes


**Given**: User has browser DevTools open (Network tab)

**When**: User navigates to home page

**Then**:
- [ ] Page loads in under 3 seconds (3G network)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s


**When**: User navigates to catalog page

**Then**:
- [ ] Page loads in under 3 seconds
- [ ] Products appear within 2 seconds

---

### Test Scenario 4.2: Filter Performance

**Priority**: Medium

**Estimated Time**: 3 minutes


**Given**: User is on catalog with 100+ products

**When**: User applies a filter

**Then**:
- [ ] Product grid updates within 500ms
- [ ] No noticeable lag or jank
- [ ] Smooth animation/transition

---

## Accessibility Tests

### Test Scenario 5.1: Keyboard Navigation

**Priority**: High

**Estimated Time**: 5 minutes


**Given**: User is on catalog page

**When**: User presses Tab key repeatedly

**Then**:
- [ ] Focus moves through all interactive elements in logical order:
  - Logo/Home link
  - Search input
  - Cart button
  - Quote button
  - Navigation links
  - Filter checkboxes
  - Sort dropdown
  - Product cards
  - Pagination buttons


**When**: User navigates to search input and types
**And**: User presses Tab key

**Then**:
- [ ] Focus moves to first search result (if dropdown is open)


**When**: User presses Arrow Down in search results

**Then**:
- [ ] Focus moves to next result


**When**: User presses Enter on focused result

**Then**:
- [ ] Navigates to that product/category

---

### Test Scenario 5.2: Screen Reader Testing

**Priority**: Medium

**Estimated Time**: 10 minutes


**Given**: User has screen reader enabled (e.g., NVDA, JAWS, VoiceOver)

**When**: User navigates the catalog page

**Then**:
- [ ] All images have alt text
- [ ] All buttons have accessible labels
- [ ] Form fields have associated labels
- [ ] ARIA labels are present where needed
- [ ] Headings follow logical hierarchy (h1, h2, h3)

---

### Test Scenario 5.3: Color Contrast

**Priority**: Medium

**Estimated Time**: 3 minutes


**Given**: User inspects page with accessibility tools

**When**: User runs axe DevTools or WAVE

**Then**:
- [ ] No color contrast issues reported
- [ ] Text meets WCAG AA standards (4.5:1 ratio)
- [ ] Interactive elements are clearly visible

---

## Browser Compatibility

### Test Scenario 6.1: Cross-Browser Testing

**Priority**: High

**Estimated Time**: 20 minutes

**Test the following scenarios on each browser**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Core flows to test**:
1. Navigate to home page → Catalog
2. Apply filters
3. Search products
4. Navigate to category page
5. Pagination

**Expected**:
- [ ] All features work consistently across browsers
- [ ] UI renders correctly
- [ ] No browser-specific JavaScript errors

---

## Test Checklist Summary

### Phase 1 Checklist
- [ ] 1.1: Home page loads correctly
- [ ] 1.2: Header navigation links work
- [ ] 1.3: Responsive design works on mobile/tablet/desktop

### Phase 2 Checklist
- [ ] 2.1: Navigate to catalog
- [ ] 2.2: Filter by family
- [ ] 2.3: Filter by grade
- [ ] 2.4: Filter by standard
- [ ] 2.5: Filter by availability
- [ ] 2.6: Apply multiple filters
- [ ] 2.7: Sort products
- [ ] 2.8: Pagination works
- [ ] 2.9: Breadcrumb navigation
- [ ] 2.10: Basic search
- [ ] 2.11: Autocomplete interaction
- [ ] 2.12: Clear search
- [ ] 2.13: Enter key navigation
- [ ] 2.14: No results handling
- [ ] 2.15: Category results in search
- [ ] 2.16: Category page automatic filtering
- [ ] 2.17: All categories work correctly
- [ ] 2.18: URL state persistence
- [ ] 2.19: Product grid displays correctly
- [ ] 2.20: Loading states work
- [ ] 2.21: Filter panel responsiveness
- [ ] 2.22: Combined filter and sort

### Phase 3 Checklist - Product Detail Page
- [ ] 3.1: Navigate to PDP
- [ ] 3.2: Hero section display
- [ ] 3.3: Specification table display
- [ ] 3.4: Selling unit selection
- [ ] 3.5: Length options
- [ ] 3.6: Quantity input
- [ ] 3.7: Finish selection
- [ ] 3.8: Cut to length toggle
- [ ] 3.9: Cut list editor - add items
- [ ] 3.10: Cut list editor - edit/remove
- [ ] 3.11: Cut list editor - waste calculation
- [ ] 3.12: CSV export
- [ ] 3.13: CSV import
- [ ] 3.14: Weight estimator display
- [ ] 3.15: Price estimator display
- [ ] 3.16: Delivery information
- [ ] 3.17: Add to estimate button
- [ ] 3.18: Real-time calculation performance
- [ ] 3.19: PDP responsive design
- [ ] 3.20: PDP loading states
- [ ] 3.21: PDP breadcrumb navigation
- [ ] 3.22: Back to catalog navigation
- [ ] 3.23: Related products section
- [ ] 3.24: URL direct access
- [ ] 3.25: Multiple configuration changes
- [ ] 3.26: PDP keyboard navigation
- [ ] 3.27: PDP edge cases - invalid inputs
- [ ] 3.28: PDP cross-browser compatibility

### Edge Cases & Errors
- [ ] 4.1: Invalid URL parameters
- [ ] 4.2: Network failure handling
- [ ] 4.3: Special characters in search

### Performance
- [ ] 5.1: Page load performance
- [ ] 5.2: Filter performance

### Accessibility
- [ ] 6.1: Keyboard navigation
- [ ] 6.2: Screen reader compatibility
- [ ] 6.3: Color contrast

### Browser Compatibility
- [ ] 7.1: Cross-browser testing

---

## Test Execution Tracking

**Tester Name**: _______________
**Date**: _______________
**Build Version**: _______________
**Test Environment**: http://localhost:8081/

### Results Summary

| Test Scenario | Status | Notes |
|---------------|--------|-------|
| 1.1 - Home Page Load | ⬜ Pass ⬜ Fail | |
| 1.2 - Header Navigation | ⬜ Pass ⬜ Fail | |
| 1.3 - Responsive Design | ⬜ Pass ⬜ Fail | |
| 2.1 - Navigate to Catalog | ⬜ Pass ⬜ Fail | |
| 2.2 - Filter by Family | ⬜ Pass ⬜ Fail | |
| 2.3 - Filter by Grade | ⬜ Pass ⬜ Fail | |
| 2.4 - Filter by Standard | ⬜ Pass ⬜ Fail | |
| 2.5 - Filter by Availability | ⬜ Pass ⬜ Fail | |
| 2.6 - Multiple Filters | ⬜ Pass ⬜ Fail | |
| 2.7 - Sort Products | ⬜ Pass ⬜ Fail | |
| 2.8 - Pagination | ⬜ Pass ⬜ Fail | |
| 2.9 - Breadcrumb Navigation | ⬜ Pass ⬜ Fail | |
| 2.10 - Basic Search | ⬜ Pass ⬜ Fail | |
| 2.11 - Autocomplete | ⬜ Pass ⬜ Fail | |
| 2.12 - Clear Search | ⬜ Pass ⬜ Fail | |
| 2.13 - Enter Key Navigation | ⬜ Pass ⬜ Fail | |
| 2.14 - No Results | ⬜ Pass ⬜ Fail | |
| 2.15 - Category Results | ⬜ Pass ⬜ Fail | |
| 2.16 - Category Auto-Filter | ⬜ Pass ⬜ Fail | |
| 2.17 - All Categories | ⬜ Pass ⬜ Fail | |
| 2.18 - URL Persistence | ⬜ Pass ⬜ Fail | |
| 2.19 - Product Grid Display | ⬜ Pass ⬜ Fail | |
| 2.20 - Loading States | ⬜ Pass ⬜ Fail | |
| 2.21 - Filter Responsiveness | ⬜ Pass ⬜ Fail | |
| 2.22 - Combined Filter/Sort | ⬜ Pass ⬜ Fail | |
| 3.1 - Navigate to PDP | ⬜ Pass ⬜ Fail | |
| 3.2 - PDP Hero Section | ⬜ Pass ⬜ Fail | |
| 3.3 - Spec Table Display | ⬜ Pass ⬜ Fail | |
| 3.4 - Selling Unit Selection | ⬜ Pass ⬜ Fail | |
| 3.5 - Length Options | ⬜ Pass ⬜ Fail | |
| 3.6 - Quantity Input | ⬜ Pass ⬜ Fail | |
| 3.7 - Finish Selection | ⬜ Pass ⬜ Fail | |
| 3.8 - Cut to Length Toggle | ⬜ Pass ⬜ Fail | |
| 3.9 - Cut List Add Items | ⬜ Pass ⬜ Fail | |
| 3.10 - Cut List Edit/Remove | ⬜ Pass ⬜ Fail | |
| 3.11 - Waste Calculation | ⬜ Pass ⬜ Fail | |
| 3.12 - CSV Export | ⬜ Pass ⬜ Fail | |
| 3.13 - CSV Import | ⬜ Pass ⬜ Fail | |
| 3.14 - Weight Estimator | ⬜ Pass ⬜ Fail | |
| 3.15 - Price Estimator | ⬜ Pass ⬜ Fail | |
| 3.16 - Delivery Info | ⬜ Pass ⬜ Fail | |
| 3.17 - Add to Estimate Button | ⬜ Pass ⬜ Fail | |
| 3.18 - Real-time Performance | ⬜ Pass ⬜ Fail | |
| 3.19 - PDP Responsive Design | ⬜ Pass ⬜ Fail | |
| 3.20 - PDP Loading States | ⬜ Pass ⬜ Fail | |
| 3.21 - PDP Breadcrumb Nav | ⬜ Pass ⬜ Fail | |
| 3.22 - Back to Catalog | ⬜ Pass ⬜ Fail | |
| 3.23 - Related Products | ⬜ Pass ⬜ Fail | |
| 3.24 - URL Direct Access | ⬜ Pass ⬜ Fail | |
| 3.25 - Multiple Config Changes | ⬜ Pass ⬜ Fail | |
| 3.26 - PDP Keyboard Nav | ⬜ Pass ⬜ Fail | |
| 3.27 - PDP Edge Cases | ⬜ Pass ⬜ Fail | |
| 3.28 - PDP Cross-Browser | ⬜ Pass ⬜ Fail | |

### Critical Bugs Found
1. _______________
2. _______________
3. _______________

### Minor Issues Found
1. _______________
2. _______________
3. _______________

### Overall Test Result
- ⬜ All tests passed
- ⬜ Tests passed with minor issues
- ⬜ Critical bugs found - DO NOT RELEASE

---

**Last Updated**: 2025-10-18
**Version**: 1.1.0
**Phase Coverage**: Phase 1 (Infrastructure), Phase 2 (Catalog), Phase 3 (Product Detail Page)
**Total Test Scenarios**: 79 scenarios
**Next Review**: After Phase 4 implementation
