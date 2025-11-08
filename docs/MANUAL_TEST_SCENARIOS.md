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

## Phase 4: Estimate Cart & RFQ Flow

### Test Scenario 4.1: Add Product to Cart

**Priority**: Critical

**Estimated Time**: 4 minutes


**Given**: User is on a product detail page (e.g., /product/profil-hea-200-s235jr-en-10025)

**When**: User configures product:
- Selling unit: Metri (m)
- Length: 6m
- Quantity: 10
- Finish: Standard

**And**: User clicks "Adaugă la Estimare" button

**Then**:
- [ ] Toast notification appears showing "Produs adăugat în coș"
- [ ] Toast displays product name, quantity, and estimated weight
- [ ] Cart drawer automatically opens from right side
- [ ] Product appears in cart drawer with correct configuration
- [ ] Cart badge in header updates to show "1"
- [ ] Button remains enabled for adding more


**When**: User adds the same product again with different config:
- Quantity: 5
- Finish: Zincat (+15%)

**Then**:
- [ ] Second line item is added to cart (not merged)
- [ ] Cart badge shows "2"
- [ ] Both items visible in cart drawer
- [ ] Totals update to reflect both items

---

### Test Scenario 4.2: Cart Drawer Functionality

**Priority**: Critical

**Estimated Time**: 5 minutes


**Given**: User has 2 products in cart

**When**: User clicks cart badge in header

**Then**:
- [ ] Cart drawer opens from right side with slide animation
- [ ] Drawer title shows "Coș Estimare"
- [ ] Subtitle shows "2 produse în coș"
- [ ] All cart items are visible
- [ ] Each item shows:
  - Product image/icon
  - Product title and SKU
  - Configuration badges (grade, finish, length)
  - Quantity and unit
  - Estimated weight
  - Unit price and subtotal
  - Remove button (trash icon)
- [ ] Totals panel displays:
  - Total weight
  - Subtotal
  - TVA (19%)
  - Delivery estimate
  - Grand total in RON


**When**: User clicks "Cere Ofertă Finală" button

**Then**:
- [ ] Drawer closes
- [ ] Browser navigates to /rfq
- [ ] RFQ form loads


**When**: User clicks "Vezi Coș Complet" button

**Then**:
- [ ] Drawer closes
- [ ] Browser navigates to /cart
- [ ] Full cart page loads


**When**: User clicks outside drawer or presses Escape

**Then**:
- [ ] Drawer closes smoothly
- [ ] Cart data remains intact

---

### Test Scenario 4.3: Cart Page - Full View

**Priority**: Critical

**Estimated Time**: 6 minutes


**Given**: User navigates to /cart with items in cart

**When**: Page loads

**Then**:
- [ ] Page header shows "Coș Estimare"
- [ ] Item count displays "X produse în coș"
- [ ] Info alert explains prices are estimative
- [ ] All cart items displayed as cards
- [ ] Right sidebar shows:
  - Totals panel
  - Action buttons
  - Help card with contact info
- [ ] "Golește Coșul" button visible in header


**When**: User clicks edit button on a line item

**Then**:
- [ ] Quantity input becomes editable
- [ ] Unit dropdown appears
- [ ] Save (checkmark) and Cancel (X) buttons appear


**When**: User changes quantity from 10 to 15

**And**: User clicks save button

**Then**:
- [ ] Quantity updates to 15
- [ ] Line subtotal recalculates
- [ ] Total weight updates
- [ ] Grand total updates
- [ ] Edit mode closes
- [ ] All updates occur in < 150ms


**When**: User clicks trash icon on a line item

**Then**:
- [ ] Item is removed from cart
- [ ] Totals update immediately
- [ ] Item count decreases
- [ ] If last item removed, empty state appears


**When**: User clicks "Golește Coșul" button

**And**: User confirms in alert dialog

**Then**:
- [ ] All items removed
- [ ] Empty state displayed
- [ ] Message: "Coșul tău este gol"
- [ ] "Explorează Catalogul" button visible


**When**: Cart has items and user checks disclaimer checkbox

**Then**:
- [ ] Checkbox becomes checked
- [ ] "Cere Ofertă Finală" button becomes enabled


**When**: User clicks "Cere Ofertă Finală" (with disclaimer checked)

**Then**:
- [ ] Browser navigates to /rfq

---

### Test Scenario 4.4: Cart Persistence Across Sessions

**Priority**: High

**Estimated Time**: 3 minutes


**Given**: User has 3 items in cart

**When**: User refreshes the page (F5)

**Then**:
- [ ] Page reloads
- [ ] All 3 items still in cart
- [ ] Quantities correct
- [ ] Totals correct
- [ ] Cart badge shows "3"


**When**: User closes browser tab

**And**: User opens new tab to http://localhost:8080

**Then**:
- [ ] Cart badge shows "3"
- [ ] Opening cart drawer shows all 3 items
- [ ] All data persisted


**When**: User clears browser localStorage manually

**And**: User refreshes page

**Then**:
- [ ] Cart is empty
- [ ] Cart badge shows no number
- [ ] Opening drawer shows empty state

---

### Test Scenario 4.5: RFQ Form - Step 1: Company Information

**Priority**: Critical

**Estimated Time**: 8 minutes


**Given**: User navigates to /rfq with items in cart

**When**: Page loads

**Then**:
- [ ] URL is /rfq
- [ ] Page title shows "Cerere de Ofertă (RFQ)"
- [ ] Step indicator shows Step 1 of 5 active
- [ ] "Companie" step is highlighted
- [ ] Form displays "Informații Companie" card
- [ ] All required fields marked with red asterisk *


**When**: User enters CUI/VAT: "14399840"

**And**: User clicks "Validează" button

**Then**:
- [ ] Button shows loading spinner: "Validare..."
- [ ] Button is disabled during validation
- [ ] After ~800ms, validation completes
- [ ] CUI remains "14399840" (format preserved as entered)
- [ ] Green success alert appears
- [ ] Alert shows: "CUI/VAT validat în baza ANAF"


**When**: CUI validation succeeds with business data

**Then**:
- [ ] Legal name field auto-fills: "S.C. METALPRO INDUSTRIES S.R.L."
- [ ] County field auto-fills: "CLUJ"
- [ ] Green "Verificat" badge appears


**When**: User enters CUI with "RO" prefix: "RO14399840"

**And**: User clicks "Validează"

**Then**:
- [ ] CUI remains "RO14399840" (RO prefix preserved)
- [ ] Validation succeeds
- [ ] Business data auto-fills correctly
- [ ] Input shows "RO14399840" (original format kept)


**When**: User enters invalid CUI: "123"

**And**: User clicks "Validează"

**Then**:
- [ ] Red error alert appears
- [ ] Message shows: "CUI/VAT este prea scurt (minim 2 cifre)"
- [ ] Legal name does not auto-fill


**When**: User enters invalid CUI with wrong checksum: "14399841"

**And**: User clicks "Validează"

**Then**:
- [ ] Red error alert shows
- [ ] Message: "CUI/VAT nu este valid (cifră de control incorectă)"


**When**: User completes all required fields:
- Legal name: "S.C. TEST METAL S.R.L."
- CUI/VAT: "RO12345678" (validated)
- Street: "Str. Testului, nr. 10"
- City: "Cluj-Napoca"
- County: "Cluj" (from dropdown)
- Postal code: "400001"
- Contact person: "Ion Popescu"
- Phone: "+40712345678"
- Email: "ion@testmetal.ro"

**And**: User clicks "Continuă" button

**Then**:
- [ ] No validation errors
- [ ] Step 1 marked as completed (checkmark)
- [ ] Form advances to Step 2
- [ ] Step indicator updates
- [ ] "Livrare" step becomes active

---

### Test Scenario 4.6: RFQ Form - Step 2: Delivery Address

**Priority**: Critical

**Estimated Time**: 5 minutes


**Given**: User is on Step 2 of RFQ form

**When**: Step loads

**Then**:
- [ ] "Adresa de Livrare" card displays
- [ ] "Identică cu adresa de facturare" checkbox is CHECKED by default
- [ ] Summary shows billing address below checkbox
- [ ] All address fields are DISABLED
- [ ] Fields are pre-filled with billing address from Step 1


**When**: User unchecks "Identică cu adresa de facturare"

**Then**:
- [ ] All address fields become ENABLED
- [ ] Fields clear (or retain previous delivery address if exists)
- [ ] User can type in fields


**When**: User enters different delivery address:
- Street: "Str. Livrare, nr. 25"
- City: "București"
- County: "București"
- Postal code: "010101"

**And**: User selects desired delivery date (5 days from today)

**Then**:
- [ ] Calendar picker opens
- [ ] Calendar is in Romanian locale
- [ ] Dates before today are disabled
- [ ] Selected date displays in Romanian format (ex: "5 ianuarie 2025")


**When**: User clicks "Înapoi" button

**Then**:
- [ ] Form returns to Step 1
- [ ] All data from Step 1 is still intact
- [ ] No data is lost


**When**: User clicks "Continuă" from Step 1 again

**And**: User is back on Step 2

**Then**:
- [ ] Delivery address data is preserved
- [ ] Checkbox state is preserved
- [ ] Desired date is preserved


**When**: User clicks "Continuă" button on Step 2

**Then**:
- [ ] Step 2 marked as completed
- [ ] Form advances to Step 3
- [ ] "Preferințe" step becomes active

---

### Test Scenario 4.7: RFQ Form - Step 3: Preferences

**Priority**: High

**Estimated Time**: 4 minutes


**Given**: User is on Step 3 of RFQ form

**When**: Step loads

**Then**:
- [ ] "Preferințe & Cerințe Speciale" card displays
- [ ] Incoterm dropdown shows placeholder: "Selectează Incoterm (sau lasă implicit)"
- [ ] Payment terms textarea is empty
- [ ] Special requirements textarea is empty
- [ ] Helpful tips alert is visible


**When**: User clicks Incoterm dropdown

**Then**:
- [ ] Dropdown opens showing 5 options:
  - EXW - Ex Works
  - FCA - Free Carrier
  - CPT - Carriage Paid To
  - DAP - Delivered at Place
  - DDP - Delivered Duty Paid


**When**: User selects "DAP - Delivered at Place"

**Then**:
- [ ] Dropdown value updates
- [ ] Blue info alert appears below
- [ ] Alert shows description: "DAP: Vânzătorul livrează marfa la adresa specificată"


**When**: User types in "Special Requirements" field: "Debitare urgentă necesară pentru proiect"

**Then**:
- [ ] Text appears in textarea
- [ ] Character counter shows: "XX / 1000 caractere"
- [ ] Counter updates in real-time


**When**: User types in "Payment Terms" field: "30 zile de la facturare"

**Then**:
- [ ] Text is accepted
- [ ] No validation errors


**When**: User clicks "Continuă" button

**Then**:
- [ ] Step 3 marked as completed
- [ ] Form advances to Step 4
- [ ] "Atașamente" step becomes active


**Note**: All fields in this step are optional, so form should proceed even if left blank

---

### Test Scenario 4.8: RFQ Form - Step 4: Attachments & File Upload

**Priority**: High

**Estimated Time**: 7 minutes


**Given**: User is on Step 4 of RFQ form

**When**: Step loads

**Then**:
- [ ] "Atașamente & Notițe" card displays
- [ ] Upload area with dashed border visible
- [ ] Upload icon and instructions visible
- [ ] "Selectează Fișiere" button present
- [ ] Empty state: "Nu există fișiere încărcate"
- [ ] Notes textarea is empty


**When**: User clicks "Selectează Fișiere" button

**Then**:
- [ ] File picker dialog opens
- [ ] Only .csv, .xlsx, .pdf, .jpg, .png files are selectable


**When**: User selects a valid PDF file (< 10MB)

**Then**:
- [ ] File appears in uploaded files list
- [ ] File row shows:
  - PDF icon (red)
  - File name
  - "PDF" badge
  - File size (e.g., "2.5 MB")
  - Remove button (X icon)
- [ ] Green success alert: "Fișierele vor fi atașate cererii"


**When**: User tries to upload a 15MB file

**Then**:
- [ ] File is rejected
- [ ] Red error alert appears
- [ ] Message: "Fișierul 'X' este prea mare (maxim 10MB)"
- [ ] File does NOT appear in list


**When**: User tries to upload a .exe file

**Then**:
- [ ] File is rejected
- [ ] Error message: "Tipul fișierului 'X' nu este permis"


**When**: User drags a .csv file over upload area

**Then**:
- [ ] Upload area highlights (hover effect)


**When**: User drops the file

**Then**:
- [ ] File is processed
- [ ] File appears in uploaded files list
- [ ] CSV icon (green) displayed
- [ ] "CSV" badge shown


**When**: User uploads multiple files at once:
- BOM.csv (500 KB)
- Drawing.pdf (3 MB)
- Photo.jpg (1.5 MB)

**Then**:
- [ ] All 3 files appear in list
- [ ] Each has appropriate icon and badge
- [ ] Total count shows "Fișiere încărcate (3)"


**When**: User clicks X button on one file

**Then**:
- [ ] File is removed from list
- [ ] Count updates to "Fișiere încărcate (2)"
- [ ] No confirmation dialog needed


**When**: User types in Notes textarea: "Lista BOM anexată. Vă rog să confirmați disponibilitatea materialelor."

**Then**:
- [ ] Text appears in textarea
- [ ] Character counter shows: "XX / 2000 caractere"


**When**: User clicks "Continuă la Verificare" button

**Then**:
- [ ] Step 4 marked as completed
- [ ] Form advances to Step 5
- [ ] "Verificare" step becomes active

---

### Test Scenario 4.9: RFQ Form - Step 5: Review & Submit

**Priority**: Critical

**Estimated Time**: 10 minutes


**Given**: User is on Step 5 (final review) of RFQ form

**When**: Step loads

**Then**:
- [ ] Blue info alert at top: "Verificați Informațiile"
- [ ] "Informații Companie" card displays with:
  - Company name
  - CUI/VAT number with "Verificat" badge
  - Complete billing address
  - Contact person, phone, email
  - "Editează" button in header
- [ ] "Adresa de Livrare" card displays with:
  - Delivery address
  - "Identică cu adresa de facturare" badge (if applicable)
  - Desired delivery date (formatted in Romanian)
  - "Editează" button
- [ ] "Produse Estimate" card displays with:
  - Total item count
  - Total weight
  - All cart line items with quantities and prices
  - Subtotal, TVA, Delivery estimate
  - Grand total in bold
- [ ] "Preferințe & Cerințe" card (if data exists)
- [ ] "Atașamente" card showing all uploaded files
- [ ] "Acceptare Termeni" card with 2 unchecked checkboxes
- [ ] "Trimite Cerere de Ofertă" button is DISABLED


**When**: User clicks "Editează" button on Company card

**Then**:
- [ ] Form navigates back to Step 1
- [ ] All company data is intact
- [ ] User can edit fields


**When**: User clicks "Continuă" to return to Review

**Then**:
- [ ] Form returns to Step 5
- [ ] Changes are reflected in review


**When**: User checks first disclaimer checkbox: "Înțeleg că prețurile sunt strict estimative"

**Then**:
- [ ] Checkbox becomes checked
- [ ] "Trimite" button still DISABLED (both required)


**When**: User checks second checkbox: "Accept termenii și condițiile"

**Then**:
- [ ] Checkbox becomes checked
- [ ] "Trimite Cerere de Ofertă" button becomes ENABLED
- [ ] Button has primary styling


**When**: User unchecks first checkbox

**Then**:
- [ ] "Trimite" button becomes DISABLED again
- [ ] Red error alert appears: "Vă rugăm să acceptați ambii termeni"


**When**: User checks both checkboxes again

**And**: User clicks "Trimite Cerere de Ofertă" button

**Then**:
- [ ] Button shows loading state: "Se trimite..."
- [ ] Button is disabled during submission
- [ ] Loading spinner appears
- [ ] After ~1.5 seconds, submission completes
- [ ] Browser navigates to /rfq/confirmation with reference number in URL


**When**: Submission fails (simulate network error)

**Then**:
- [ ] Toast error notification appears
- [ ] Message: "Nu s-a putut trimite cererea"
- [ ] User remains on Step 5
- [ ] Button becomes enabled again
- [ ] User can retry

---

### Test Scenario 4.10: RFQ Confirmation Page

**Priority**: Critical

**Estimated Time**: 5 minutes


**Given**: User successfully submitted RFQ

**When**: Confirmation page loads (/rfq/confirmation?ref=RFQ-2025-1234)

**Then**:
- [ ] URL contains reference number parameter
- [ ] Green checkmark icon displayed (large, centered)
- [ ] Success message: "Cererea a fost trimisă cu succes!"
- [ ] Reference number card shows:
  - Label: "Număr de Referință"
  - Reference number in large monospace font: "RFQ-2025-1234"
  - Note to save the number
- [ ] "Ce urmează?" card displays 4-step timeline:
  1. Confirmare Email
  2. Procesare Cerere
  3. Primire Ofertă (maximum 24h)
  4. Negociere & Finalizare
- [ ] Contact card shows:
  - Phone: +40 xxx xxx xxx
  - Email: sales@metalpro.ro
  - Business hours: L-V, 08:00-16:30
- [ ] Two action buttons:
  - "Înapoi la Pagina Principală" (primary)
  - "Explorează Catalogul" (outline)
- [ ] Footer note about spam folder


**When**: User checks cart badge in header

**Then**:
- [ ] Cart badge shows no number (cart was cleared)
- [ ] Opening cart drawer shows empty state


**When**: User clicks "Înapoi la Pagina Principală" button

**Then**:
- [ ] Browser navigates to /
- [ ] Home page loads


**When**: User navigates back to /rfq/confirmation without ref parameter

**Then**:
- [ ] Page redirects to home page
- [ ] No error displayed

---

### Test Scenario 4.11: RFQ Form - Empty Cart Protection

**Priority**: High

**Estimated Time**: 3 minutes


**Given**: User has empty cart

**When**: User navigates directly to /rfq

**Then**:
- [ ] Page loads
- [ ] Red alert displays: "Coșul este gol"
- [ ] Message: "Pentru a putea cere o ofertă, trebuie să adaugi produse în coș"
- [ ] "Înapoi la Catalog" button is visible
- [ ] RFQ form is NOT displayed


**When**: User clicks "Înapoi la Catalog" button

**Then**:
- [ ] Browser navigates to /catalog

---

### Test Scenario 4.12: Cart & RFQ Integration - Complete Flow

**Priority**: Critical

**Estimated Time**: 15 minutes


**Given**: User starts from empty cart

**When**: User performs complete flow:

1. Navigate to product: /product/profil-hea-200-s235jr-en-10025
2. Add to cart (10m, Standard finish)
3. Navigate to another product
4. Add to cart (5 units, Zincat finish)
5. Click cart badge in header
6. Verify 2 items in drawer
7. Click "Cere Ofertă Finală"
8. Complete Step 1: Company Info with CUI validation
9. Complete Step 2: Delivery (same as billing + desired date)
10. Complete Step 3: Preferences (select DAP Incoterm)
11. Complete Step 4: Upload 2 files (CSV + PDF)
12. Review Step 5: Verify all data
13. Accept both disclaimers
14. Submit RFQ

**Then**:
- [ ] Each step transitions smoothly
- [ ] Data persists across steps
- [ ] No errors occur
- [ ] Submission succeeds
- [ ] Confirmation page loads with reference number
- [ ] Cart is cleared
- [ ] Reference number format: RFQ-YYYY-XXXX


**When**: User opens browser DevTools console

**Then**:
- [ ] Console logs show:
  - "RFQ Submitted: {referenceNumber, company, totalItems, totalValue}"
  - "📧 Email notifications sent"
  - "✅ To customer: [email]"
  - "✅ To sales team: sales@metalpro.ro"
- [ ] No JavaScript errors
- [ ] No React warnings

---

### Test Scenario 4.13: Cart Totals Calculation Accuracy

**Priority**: Critical

**Estimated Time**: 5 minutes


**Given**: User has empty cart

**When**: User adds product: HEA 200, 10m, S235JR
- Unit weight: 10.5 kg/m
- Base price: 45.50 RON/kg
- Quantity: 1 piece at 6m length

**Then**:
- [ ] Weight estimate: 6m × 10.5 kg/m = 63.00 kg
- [ ] Subtotal: 63 kg × 45.50 RON/kg = 2,866.50 RON
- [ ] TVA (19%): 2,866.50 × 0.19 = 544.64 RON
- [ ] Grand Total: 2,866.50 + 544.64 = 3,411.14 RON
- [ ] Delivery band: "150-300 RON" (weight between 100-500kg)


**When**: User changes finish to "Zincat (+15%)"

**Then**:
- [ ] Subtotal increases by 15%: 2,866.50 × 1.15 = 3,296.48 RON
- [ ] TVA recalculates: 3,296.48 × 0.19 = 626.33 RON
- [ ] Grand Total: 3,296.48 + 626.33 = 3,922.81 RON
- [ ] Weight remains: 63.00 kg (finish doesn't affect weight)


**When**: User changes quantity to 5 pieces

**Then**:
- [ ] Weight: 63 kg × 5 = 315.00 kg
- [ ] Subtotal: 3,296.48 × 5 = 16,482.40 RON
- [ ] TVA: 16,482.40 × 0.19 = 3,131.66 RON
- [ ] Grand Total: 16,482.40 + 3,131.66 = 19,614.06 RON
- [ ] Delivery band: "300-500 RON" (weight between 100-500kg)

---

### Test Scenario 4.14: CUI/VAT Validation - Edge Cases

**Priority**: High

**Estimated Time**: 6 minutes


**Given**: User is on RFQ Step 1: Company Information

**When**: User enters various CUI formats and validates:

| Input | Expected Result |
|-------|----------------|
| "14399840" | ✅ Valid → kept as "14399840" (valid checksum) |
| "RO14399840" | ✅ Valid → kept as "RO14399840" (format preserved) |
| "  RO14399840  " | ✅ Valid → cleaned to "RO14399840" |
| "ro14399840" | ✅ Valid → uppercased to "RO14399840" |
| "18547290" | ✅ Valid → kept as "18547290" (valid checksum) |
| "RO 143 998 40" | ✅ Valid → cleaned to "RO14399840" |
| "123" | ❌ "CUI/VAT este prea scurt" |
| "12345678901234" | ❌ "CUI/VAT este prea lung" |
| "ABC123" | ❌ "trebuie să conțină doar cifre" |
| "14399841" | ❌ "cifră de control incorectă" (wrong checksum) |
| "" (empty) | ❌ "CUI/VAT este obligatoriu" |

**Then**:
- [ ] All validations work correctly
- [ ] Appropriate error messages display
- [ ] Valid CUIs are formatted consistently
- [ ] Invalid CUIs prevent form submission

---

### Test Scenario 4.15: File Upload - Size & Type Validation

**Priority**: High

**Estimated Time**: 5 minutes


**Given**: User is on RFQ Step 4: Attachments

**When**: User attempts to upload files:

| File | Size | Type | Expected Result |
|------|------|------|----------------|
| BOM.csv | 500 KB | CSV | ✅ Accepted |
| Price_List.xlsx | 2 MB | Excel | ✅ Accepted |
| Drawing.pdf | 8 MB | PDF | ✅ Accepted |
| Photo.jpg | 1.5 MB | Image | ✅ Accepted |
| BigFile.pdf | 15 MB | PDF | ❌ "prea mare (maxim 10MB)" |
| Virus.exe | 100 KB | EXE | ❌ "tipul fișierului nu este permis" |
| Document.doc | 1 MB | Word | ❌ "tipul fișierului nu este permis" |

**Then**:
- [ ] Valid files appear in uploaded list
- [ ] Invalid files show error alerts
- [ ] No invalid files in uploaded list
- [ ] Error messages are clear and helpful

---

### Test Scenario 4.16: Responsive Design - Cart & RFQ (Mobile)

**Priority**: High

**Estimated Time**: 8 minutes


**Given**: User accesses site on mobile (375px width)

**When**: User adds product to cart

**Then**:
- [ ] Cart drawer opens full-screen on mobile
- [ ] All elements are touch-friendly (min 44px)
- [ ] Scrolling works smoothly
- [ ] Buttons are accessible


**When**: User navigates to /cart page

**Then**:
- [ ] Page layout stacks vertically
- [ ] Cart items display in single column
- [ ] Totals panel moves below items (not sidebar)
- [ ] All text remains readable
- [ ] No horizontal scrolling


**When**: User navigates to /rfq

**Then**:
- [ ] Step indicator shows compact mobile version
- [ ] Shows current step number and title
- [ ] Progress counter: "Pasul X din 5"
- [ ] Form fields stack vertically
- [ ] County dropdown works on mobile
- [ ] Date picker is mobile-friendly
- [ ] File upload works with mobile file picker
- [ ] All buttons are full-width on mobile

---

### Test Scenario 4.17: Browser Back/Forward Navigation

**Priority**: Medium

**Estimated Time**: 4 minutes


**Given**: User is completing RFQ form

**When**: User completes Step 1 and proceeds to Step 2

**And**: User clicks browser back button

**Then**:
- [ ] Form returns to Step 1
- [ ] URL updates (if using URL state)
- [ ] Step 1 data is preserved
- [ ] No data loss


**When**: User clicks browser forward button

**Then**:
- [ ] Form returns to Step 2
- [ ] Step 2 data is preserved


**When**: User completes all steps and submits

**And**: User is on confirmation page

**And**: User clicks browser back button

**Then**:
- [ ] User remains on confirmation page (or home)
- [ ] Cart remains empty
- [ ] RFQ is not resubmitted

---

### Test Scenario 4.18: Performance - Cart Operations

**Priority**: Medium

**Estimated Time**: 5 minutes


**Given**: User has 10 items in cart

**When**: User updates quantity on one item

**Then**:
- [ ] Totals update in < 150ms
- [ ] No UI lag or jank
- [ ] Smooth animation


**When**: User adds 20 items to cart rapidly

**Then**:
- [ ] All items appear in cart
- [ ] No performance degradation
- [ ] Scrolling remains smooth
- [ ] Badge updates correctly


**When**: User opens cart drawer with 20 items

**Then**:
- [ ] Drawer opens smoothly
- [ ] All items render without delay
- [ ] Scrolling is performant

---

## Edge Cases & Error Scenarios

### Test Scenario 5.1: Invalid URL Parameters

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

### Test Scenario 5.2: Network Failure Simulation

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

### Test Scenario 5.3: Special Characters in Search

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

### Test Scenario 6.1: Page Load Performance

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

### Test Scenario 6.2: Filter Performance

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

### Test Scenario 7.1: Keyboard Navigation

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

### Test Scenario 7.2: Screen Reader Testing

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

### Test Scenario 7.3: Color Contrast

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

### Test Scenario 8.1: Cross-Browser Testing

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
