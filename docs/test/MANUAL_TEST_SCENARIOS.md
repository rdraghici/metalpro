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

### Test Scenario 2.6a: Filter Count Accuracy

**Priority**: Critical

**Estimated Time**: 5 minutes


**Given**: User is on the catalog page with no filters applied

**When**: User observes the filter options in "Categorie Produse"

**Then**:
- [ ] Each category displays a count badge on the right
- [ ] Count badges show accurate numbers (e.g., "Profile Metalice (5)", "Table de Oțel (3)")
- [ ] Sum of all category counts equals or exceeds total product count (products can belong to multiple categories)


**When**: User checks "Profile Metalice" checkbox

**Then**:
- [ ] URL updates to ?family=profiles
- [ ] Product count at top shows filtered total
- [ ] Other filter categories (Grad, Standard, Disponibilitate, Producător) update their counts
- [ ] Counts in other categories reflect only products that are profiles


**When**: User additionally applies "Grad: S235JR" filter

**Then**:
- [ ] Product grid shows only profiles with S235JR grade
- [ ] Standard filter counts update to show only standards available for S235JR profiles
- [ ] Availability filter counts update to show availability for S235JR profiles
- [ ] Producer filter counts update to show producers who make S235JR profiles
- [ ] All displayed counts are accurate when clicked


**When**: User clicks on any filter option showing a specific count (e.g., "ArcelorMittal (3)")

**Then**:
- [ ] Exactly 3 products appear in the product grid (matching the count)
- [ ] The count does NOT increase or change unexpectedly
- [ ] Filter count remains consistent with actual results

---

### Test Scenario 2.6b: Dynamic Filter Options (Zero-Count Hiding)

**Priority**: Critical

**Estimated Time**: 4 minutes


**Given**: User is on the catalog page with no filters applied

**When**: User expands all filter sections (Familie, Grad, Standard, Disponibilitate, Producător)

**Then**:
- [ ] All filter sections show their available options
- [ ] Each option has a count badge greater than 0
- [ ] No options show "(0)" count


**When**: User selects "Profile Metalice" from Categorie Produse

**Then**:
- [ ] Grad filter updates to show only grades available in profiles
- [ ] Any grades with 0 profile products are hidden (not shown at all)
- [ ] Standard filter updates to show only standards available in profiles
- [ ] Any standards with 0 profile products are hidden
- [ ] Availability filter updates (only availabilities with >0 products shown)
- [ ] Producer filter updates (only producers with >0 profile products shown)


**When**: User additionally selects "S235JR" from Grad filter

**Then**:
- [ ] Standard filter shows only standards for S235JR profiles
- [ ] Standards with 0 matching products are completely hidden (not showing with "0")
- [ ] Availability options with 0 matching products are hidden
- [ ] Producer options with 0 matching products are hidden
- [ ] All visible options have count > 0


**When**: User removes all filters

**Then**:
- [ ] All filter options return to initial state
- [ ] Previously hidden options become visible again
- [ ] All counts update to reflect full catalog

---

### Test Scenario 2.6c: Filter Option Persistence

**Priority**: Critical

**Estimated Time**: 3 minutes


**Given**: User is on the catalog page with no filters applied

**When**: User clicks on "Categorie Produse" accordion

**Then**:
- [ ] All 6 product family options are visible:
  - Profile Metalice
  - Table de Oțel
  - Țevi și Tuburi
  - Elemente de Asamblare
  - Oțel Inoxidabil
  - Metale Neferoase


**When**: User checks "Profile Metalice"

**Then**:
- [ ] "Profile Metalice" checkbox is checked
- [ ] All other 5 family options remain visible in the list
- [ ] "Table de Oțel" is still visible (not disappeared)
- [ ] "Țevi și Tuburi" is still visible
- [ ] "Elemente de Asamblare" is still visible
- [ ] "Oțel Inoxidabil" is still visible
- [ ] "Metale Neferoase" is still visible
- [ ] User can still select additional family options


**When**: User checks "Table de Oțel" additionally

**Then**:
- [ ] Both "Profile Metalice" and "Table de Oțel" are checked
- [ ] All 6 family options remain visible
- [ ] Other unchecked options (Țevi, Elemente, Oțel Inoxidabil, Metale Neferoase) are still selectable


**When**: User observes "Grad Material" filter section

**Then**:
- [ ] All grade options remain visible (not disappeared)
- [ ] Grades show updated counts based on selected families
- [ ] User can select any grade option


**When**: User observes "Standard" filter section

**Then**:
- [ ] All standard options remain visible
- [ ] Standards show updated counts based on selected families
- [ ] No filter categories have completely disappeared


**When**: User observes "Disponibilitate" and "Producător" sections

**Then**:
- [ ] All availability options remain visible
- [ ] All producer options remain visible
- [ ] All 5 filter categories (Familie, Grad, Standard, Disponibilitate, Producător) are always present

---

### Test Scenario 2.6d: Producer Filter

**Priority**: High

**Estimated Time**: 3 minutes


**Given**: User is on the catalog page

**When**: User clicks on "Producător" accordion in filter panel

**Then**:
- [ ] Producer filter section expands
- [ ] List of producers is visible (e.g., ArcelorMittal, Liberty Steel, Voestalpine, etc.)
- [ ] Each producer option has an accurate count badge


**When**: User checks "ArcelorMittal" checkbox

**Then**:
- [ ] Products are filtered to show only ArcelorMittal products
- [ ] URL updates to include ?producer=ArcelorMittal
- [ ] Filter chip displays "Producător: ArcelorMittal"
- [ ] Product count shows accurate total
- [ ] Product cards show "ArcelorMittal" as producer


**When**: User checks additional producer (e.g., "Liberty Steel")

**Then**:
- [ ] Products show both ArcelorMittal and Liberty Steel products
- [ ] URL updates to ?producer=ArcelorMittal,Liberty Steel
- [ ] Two producer filter chips appear
- [ ] Product count increases to include both producers


**When**: User applies family filter (e.g., "Profile Metalice")

**Then**:
- [ ] Producer filter updates to show only producers who make profiles
- [ ] Producers with 0 profile products are hidden
- [ ] Displayed producer counts are accurate for profiles only

---

### Test Scenario 2.6e: Category Label Correctness

**Priority**: High

**Estimated Time**: 2 minutes


**Given**: User is on the catalog page

**When**: User expands "Categorie Produse" filter section

**Then**:
- [ ] Category labels match EXACTLY with catalog categories:
  - "Profile Metalice" (not "Profile" or "Profiles")
  - "Table de Oțel" (not "Table" or "Plăci")
  - "Țevi și Tuburi" (not "Țevi" or "Pipes")
  - "Elemente de Asamblare" (not "Elemente de Fixare" or "Fasteners")
  - "Oțel Inoxidabil" (not "Inox" or "Stainless")
  - "Metale Neferoase" (not "Neferoase" or "Non-ferrous")


**When**: User checks "Profile Metalice" and looks at the filter chip

**Then**:
- [ ] Filter chip displays "Familie: Profile Metalice" (full name)


**When**: User navigates to category page /catalog/profiles

**Then**:
- [ ] Breadcrumb shows "Profile Metalice" (matching filter label)
- [ ] Page title uses same label as filter


**When**: User compares filter labels with category navigation

**Then**:
- [ ] All 6 category labels are consistent across:
  - Filter panel checkboxes
  - Filter chips
  - Breadcrumbs
  - Category page titles
  - Category navigation links

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

## Phase 5: BOM Upload & Auto-Mapping

### Test Scenario 5.1: Navigate to BOM Upload Page

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: User is on the home page

**When**: User clicks the "Încarcă BOM" button in the header navigation

**Then**:
- [ ] Browser navigates to /bom-upload
- [ ] Page title displays "Încărcare BOM"
- [ ] Subtitle explains: "Încărcați fișierul Bill of Materials (BOM) pentru a adăuga produse în coș rapid"
- [ ] Blue info alert displays with "Cum funcționează?" title
- [ ] Info alert shows 5 numbered steps
- [ ] "Descarcă Șablon CSV" button is visible
- [ ] Upload dropzone is visible with drag & drop instructions
- [ ] "Înapoi la Catalog" button is visible in top-left

---

### Test Scenario 5.2: Download BOM Template

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User is on /bom-upload page

**When**: User clicks "Descarcă Șablon CSV" button

**Then**:
- [ ] File downloads immediately
- [ ] File name is "metalpro-bom-template.csv"
- [ ] File size is less than 10KB
- [ ] Toast notification appears: "Șablon descărcat"

**When**: User opens the downloaded CSV file

**Then**:
- [ ] File contains 9 column headers: "Familie", "Standard", "Grad", "Dimensiune", "Lungime (m)", "Cantitate", "Unitate", "Finisaj", "Note"
- [ ] File contains 3 sample rows with realistic Romanian product data
- [ ] Sample data includes different product types (corniere, țevi pătrate, plăci)
- [ ] File is UTF-8 encoded and opens correctly in Excel

---

### Test Scenario 5.3: File Upload - Drag and Drop

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User has a valid BOM CSV file

**When**: User drags the file over the upload dropzone

**Then**:
- [ ] Dropzone background changes to blue/primary color
- [ ] Border becomes solid primary color
- [ ] Upload icon changes color to primary

**When**: User drops the file on the dropzone

**Then**:
- [ ] Dropzone returns to normal state
- [ ] Green success card appears showing file name and size
- [ ] File name is displayed correctly
- [ ] File size is displayed in KB or MB
- [ ] X button appears to clear the file
- [ ] Processing spinner appears briefly
- [ ] Results section loads after ~1-2 seconds

---

### Test Scenario 5.4: File Upload - Click to Select

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: User is on /bom-upload page

**When**: User clicks the "Selectează Fișier" button

**Then**:
- [ ] Browser file picker dialog opens
- [ ] Dialog accepts .csv, .xlsx, .xls files

**When**: User selects a valid CSV file

**Then**:
- [ ] Dialog closes
- [ ] Green success card appears with file info
- [ ] File processing starts automatically

---

### Test Scenario 5.5: File Validation - Invalid File Type

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: User is on /bom-upload page

**When**: User attempts to upload a .txt file

**Then**:
- [ ] Red error alert appears
- [ ] Error message: "Tipul fișierului nu este acceptat. Acceptăm: .csv, .xlsx, .xls"
- [ ] File is not processed
- [ ] Upload dropzone remains empty

---

### Test Scenario 5.6: File Validation - File Too Large

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: User has a CSV file larger than 10MB

**When**: User attempts to upload the file

**Then**:
- [ ] Red error alert appears
- [ ] Error message: "Fișierul este prea mare. Mărimea maximă: 10MB"
- [ ] File is not processed

---

### Test Scenario 5.7: BOM Parsing - Auto-Detect Headers

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: User uploads a CSV with Romanian headers

**Test Data**:
```csv
Familie,Standard,Grad,Dimensiune,Lungime (m),Cantitate,Unitate,Finisaj,Note
profiles,EN 10025,S235JR,HEA 100,6,10,buc,BRUT,Test
```

**When**: File is processed

**Then**:
- [ ] Headers are automatically detected
- [ ] No parse errors appear
- [ ] 1 row appears in the BOM table
- [ ] Row data is correctly mapped to columns

**Given**: User uploads a CSV with English headers

**Test Data**:
```csv
Family,Standard,Grade,Dimension,Length,Quantity,Unit,Finish,Notes
profiles,EN 10025,S235JR,HEA 100,6,10,pcs,RAW,Test
```

**Then**:
- [ ] English headers are detected and mapped
- [ ] Row data displays correctly

---

### Test Scenario 5.8: Auto-Matching - High Confidence Match

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: User uploads a BOM with exact product matches

**Test Data**:
```csv
Familie,Standard,Grad,Dimensiune,Cantitate,Unitate
profiles,EN 10025,S235JR,HEA 100,10,buc
profiles,EN 10025,S235JR,HEA 200,5,buc
```

**When**: File is processed

**Then**:
- [ ] "Statistici Auto-Matching" card displays
- [ ] "Încredere Mare" count shows 2
- [ ] "Încredere Medie" shows 0
- [ ] "Încredere Scăzută" shows 0
- [ ] "Nepotrivite" shows 0
- [ ] "Rata de Potrivire" shows 100%
- [ ] Each row has a green "Încredere Mare" badge
- [ ] Each row shows matched product name
- [ ] Match reason displays with score (e.g., "Score: 95/100")
- [ ] Rows are selectable (checkbox enabled)

---

### Test Scenario 5.9: Auto-Matching - Medium Confidence Match

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User uploads a BOM with partial product matches

**Test Data**:
```csv
Familie,Grad,Dimensiune,Cantitate,Unitate
profiles,S235JR,HEA,10,buc
```

**When**: File is processed

**Then**:
- [ ] Row shows yellow "Încredere Medie" badge
- [ ] Row background has subtle yellow tint
- [ ] Matched product is shown
- [ ] Match reason explains partial match
- [ ] Row is selectable

---

### Test Scenario 5.10: Auto-Matching - Low Confidence Match

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User uploads a BOM with minimal matching data

**Test Data**:
```csv
Familie,Cantitate,Unitate
profiles,10,buc
```

**When**: File is processed

**Then**:
- [ ] Row shows orange "Încredere Scăzută" badge
- [ ] Row background has subtle orange tint
- [ ] Row is NOT selectable (checkbox disabled)
- [ ] Edit button is enabled for manual mapping

---

### Test Scenario 5.11: Auto-Matching - No Match

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User uploads a BOM with unmatchable data

**Test Data**:
```csv
Familie,Grad,Dimensiune,Cantitate,Unitate
invalid_family,INVALID_GRADE,999x999x999,10,buc
```

**When**: File is processed

**Then**:
- [ ] Row shows red "Nepotrivit" badge with X icon
- [ ] Row background has subtle red tint
- [ ] "Produs Potrivit" cell shows "Nicio potrivire"
- [ ] Row is NOT selectable
- [ ] Edit button is enabled
- [ ] Alert appears: "X rânduri nu au putut fi potrivite automat"

---

### Test Scenario 5.12: Statistics Dashboard Display

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User uploads a BOM with mixed confidence levels

**Test Data**: 10 rows (5 high, 3 medium, 1 low, 1 none)

**When**: File is processed

**Then**:
- [ ] Statistics card shows 5 colored boxes
- [ ] Green box: "5" with "Încredere Mare"
- [ ] Yellow box: "3" with "Încredere Medie"
- [ ] Orange box: "1" with "Încredere Scăzută"
- [ ] Red box: "1" with "Nepotrivite"
- [ ] Blue box: "80%" with "Rata de Potrivire"
- [ ] Match rate calculation is correct: (5+3)/10 * 100 = 80%

---

### Test Scenario 5.13: Manual Mapping - Open Dialog

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: BOM results table contains an unmatched row

**When**: User clicks the Edit button (pencil icon) on an unmatched row

**Then**:
- [ ] Modal dialog opens
- [ ] Dialog title: "Mapare Manuală - Rând #X"
- [ ] Gray info card displays original BOM row data:
  - Familie
  - Grad
  - Dimensiune
  - Cantitate + Unitate
- [ ] "Categorie Produs" dropdown is visible
- [ ] "Căutare Produs" input field is visible with search icon
- [ ] Product list area shows message: "X găsite"
- [ ] "Anulează" button is visible
- [ ] "Confirmă Maparea" button is disabled (no selection yet)

---

### Test Scenario 5.14: Manual Mapping - Filter by Category

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Manual mapping dialog is open

**When**: User selects "Profile Metalice" from category dropdown

**Then**:
- [ ] Product list updates immediately
- [ ] Only products from "Profile Metalice" category are shown
- [ ] Product count updates: "X găsite"
- [ ] Each product card shows title, SKU, grade, and family badges

**When**: User selects "Toate categoriile"

**Then**:
- [ ] All products are shown again
- [ ] Product count increases

---

### Test Scenario 5.15: Manual Mapping - Search Products

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Manual mapping dialog is open

**When**: User types "HEA 200" in search field

**Then**:
- [ ] Product list filters in real-time
- [ ] Only products matching "HEA 200" in title/SKU/grade are shown
- [ ] Search is case-insensitive
- [ ] Product count updates

**When**: User clears the search field

**Then**:
- [ ] All products reappear
- [ ] Product count resets

---

### Test Scenario 5.16: Manual Mapping - Select Product

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: Manual mapping dialog shows filtered products

**When**: User clicks on a product card

**Then**:
- [ ] Product card gets blue border
- [ ] Product card background changes to light blue
- [ ] Checkmark icon appears next to product title
- [ ] Green confirmation card appears at bottom showing:
  - "Produs Selectat:"
  - Product title
  - SKU and Grade
- [ ] "Confirmă Maparea" button becomes enabled

**When**: User clicks a different product

**Then**:
- [ ] Previous selection is deselected
- [ ] New product is selected
- [ ] Green confirmation card updates

---

### Test Scenario 5.17: Manual Mapping - Confirm Mapping

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User has selected a product in manual mapping dialog

**When**: User clicks "Confirmă Maparea" button

**Then**:
- [ ] Dialog closes
- [ ] BOM table updates immediately
- [ ] Previously unmatched row now shows:
  - Green "Încredere Mare" badge
  - Selected product name
  - Match reason: "Mapare manuală: [Product Title]"
- [ ] Row becomes selectable
- [ ] Toast notification: "Mapare confirmată - Rândul #X a fost mapat la [Product]"

---

### Test Scenario 5.18: Manual Mapping - Cancel

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: Manual mapping dialog is open with a product selected

**When**: User clicks "Anulează" button

**Then**:
- [ ] Dialog closes
- [ ] No changes are made to the BOM table
- [ ] Row remains unmatched
- [ ] No toast notification appears

**When**: User clicks outside the dialog (overlay)

**Then**:
- [ ] Dialog closes without changes

---

### Test Scenario 5.19: Row Selection - Select Individual Rows

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: BOM table contains rows with high/medium confidence

**When**: User clicks checkbox on a high-confidence row

**Then**:
- [ ] Checkbox is checked
- [ ] Row background changes to light blue
- [ ] "Adaugă în Coș (1)" button updates count
- [ ] Button remains enabled

**When**: User clicks checkbox on another row

**Then**:
- [ ] Both rows are selected
- [ ] Button shows "Adaugă în Coș (2)"

**When**: User unchecks a row

**Then**:
- [ ] Row is deselected
- [ ] Row background returns to normal
- [ ] Button count decreases

---

### Test Scenario 5.20: Row Selection - Select All

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: BOM table contains 5 high-confidence and 3 medium-confidence rows

**When**: User clicks the header "Select All" checkbox

**Then**:
- [ ] All high-confidence rows are selected (5)
- [ ] All medium-confidence rows are selected (3)
- [ ] Low and unmatched rows remain unselected
- [ ] Total 8 rows selected
- [ ] Button shows "Adaugă în Coș (8)"

**When**: User clicks "Select All" checkbox again

**Then**:
- [ ] All rows are deselected
- [ ] Button shows "Adaugă în Coș (0)"
- [ ] Button is disabled

---

### Test Scenario 5.21: Delete Row

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: BOM table contains multiple rows

**When**: User clicks the trash icon on a row

**Then**:
- [ ] Row is immediately removed from table
- [ ] Total row count decreases
- [ ] Statistics update accordingly
- [ ] Match rate recalculates
- [ ] Toast notification: "Rând șters - Rândul #X a fost șters din lista BOM"

---

### Test Scenario 5.22: Add to Cart - Bulk Addition

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: User has selected 3 matched BOM rows

**When**: User clicks "Adaugă în Coș (3)" button

**Then**:
- [ ] Processing happens briefly
- [ ] Toast notification: "Produse adăugate în coș - 3 produse au fost adăugate în coș"
- [ ] After 1 second, browser navigates to /cart
- [ ] Cart page shows the 3 added products
- [ ] Each product has correct:
  - Quantity from BOM
  - Unit from BOM
  - Length (if specified)
  - Finish (if specified)
  - Notes (if specified)
- [ ] Cart header badge shows updated count
- [ ] BOM upload page clears (if user goes back)

---

### Test Scenario 5.23: Parse Errors Display

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User uploads a malformed CSV file

**Test Data**: CSV with missing required columns or corrupted data

**When**: File is processed

**Then**:
- [ ] Red error alert appears below file name
- [ ] Alert title: "Erori de Parsare"
- [ ] Alert lists specific errors with row numbers
- [ ] Examples: "Rând 5: Cantitate invalidă", "Rând 8: Lipsă coloană obligatorie"
- [ ] Valid rows (if any) are still shown in table
- [ ] Invalid rows are skipped

---

### Test Scenario 5.24: Empty Rows Handling

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: User uploads a CSV with empty rows

**Test Data**:
```csv
Familie,Cantitate,Unitate
profiles,10,buc

profiles,5,buc

```

**When**: File is processed

**Then**:
- [ ] Empty rows are skipped
- [ ] Only 2 rows appear in table
- [ ] No parse errors for empty rows
- [ ] Total row count shows 2

---

### Test Scenario 5.25: Large File Upload Performance

**Priority**: Medium
**Estimated Time**: 5 minutes

**Given**: User uploads a CSV with 100 rows

**When**: File is processed

**Then**:
- [ ] Processing completes within 5 seconds
- [ ] All 100 rows are displayed in table
- [ ] Table is scrollable
- [ ] Statistics calculate correctly
- [ ] Page remains responsive
- [ ] No browser freezing

---

### Test Scenario 5.26: Upload New File (Reset)

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User has successfully processed a BOM file and results are displayed

**When**: User clicks "Încarcă Alt Fișier" button

**Then**:
- [ ] Results section disappears
- [ ] Upload dropzone reappears
- [ ] Template download section reappears
- [ ] Previous file data is cleared
- [ ] User can upload a new file

---

### Test Scenario 5.27: BOM Upload Page - Responsive Design

**Priority**: Medium
**Estimated Time**: 5 minutes

**Given**: User is on /bom-upload page

**When**: User resizes browser to mobile width (375px)

**Then**:
- [ ] Upload dropzone adapts to single column
- [ ] Template download button remains visible
- [ ] Statistics boxes stack vertically
- [ ] BOM table is horizontally scrollable
- [ ] Edit/Delete buttons remain accessible
- [ ] Manual mapping dialog is fullscreen on mobile

---

### Test Scenario 5.28: BOM Upload - Back Navigation

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: User is on /bom-upload page

**When**: User clicks "Înapoi la Catalog" button

**Then**:
- [ ] Browser navigates to /catalog
- [ ] If user has unsaved work, consider warning (future enhancement)

---

### Test Scenario 5.29: Header "Încarcă BOM" Button Visibility

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: User is on any page

**When**: User looks at the header navigation

**Then**:
- [ ] "Încarcă BOM" button is visible on the right side of navigation
- [ ] Button has Upload icon
- [ ] Button has outline style (not filled)
- [ ] Button is accessible from all pages

**When**: User clicks the button from catalog page

**Then**:
- [ ] Browser navigates to /bom-upload

---

### Test Scenario 5.30: BOM with Special Characters

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: User uploads a CSV with Romanian diacritics and special characters

**Test Data**:
```csv
Familie,Grad,Dimensiune,Cantitate,Unitate,Note
profiles,S235JR,HEA 100,10,buc,Pentru construcție
```

**When**: File is processed

**Then**:
- [ ] Romanian characters (ă, â, î, ș, ț) display correctly
- [ ] Notes field preserves special characters
- [ ] No encoding errors
- [ ] Data is correctly matched and displayed

---

### Quick Reference Checklist - Phase 5 (BOM Upload)

#### BOM Upload Navigation & UI
- [ ] 5.1: Navigate to BOM upload page
- [ ] 5.2: Download BOM template
- [ ] 5.29: Header "Încarcă BOM" button visibility

#### File Upload
- [ ] 5.3: Drag and drop file upload
- [ ] 5.4: Click to select file upload
- [ ] 5.5: Invalid file type validation
- [ ] 5.6: File too large validation
- [ ] 5.26: Upload new file (reset)

#### BOM Parsing & Auto-Matching
- [ ] 5.7: Auto-detect headers (Romanian & English)
- [ ] 5.8: High confidence match
- [ ] 5.9: Medium confidence match
- [ ] 5.10: Low confidence match
- [ ] 5.11: No match (unmatched rows)
- [ ] 5.12: Statistics dashboard display
- [ ] 5.23: Parse errors display
- [ ] 5.24: Empty rows handling
- [ ] 5.30: Special characters support

#### Manual Mapping
- [ ] 5.13: Open manual mapping dialog
- [ ] 5.14: Filter by category
- [ ] 5.15: Search products
- [ ] 5.16: Select product
- [ ] 5.17: Confirm mapping
- [ ] 5.18: Cancel mapping

#### Row Operations
- [ ] 5.19: Select individual rows
- [ ] 5.20: Select all rows
- [ ] 5.21: Delete row
- [ ] 5.22: Add to cart - bulk addition

#### Performance & Responsiveness
- [ ] 5.25: Large file performance (100 rows)
- [ ] 5.27: Responsive design (mobile/tablet)

#### Navigation
- [ ] 5.28: Back navigation to catalog

---

## Phase 6: Optional User Accounts & B2B Benefits

> **IMPORTANT**: Authentication is 100% OPTIONAL. All core features (catalog, cart, RFQ, BOM) must work without requiring an account. This phase tests both guest flows and authenticated user flows.

### Test Scenario 6.1: Guest User Can Access All Core Features

**Priority**: Critical

**Estimated Time**: 5 minutes

**Given**: User is not logged in (guest user)

**When**: User navigates the application

**Then**:
- [ ] Home page loads without prompts to login
- [ ] User can browse catalog without authentication
- [ ] User can add products to cart without authentication
- [ ] User can submit RFQ without authentication (manual data entry)
- [ ] User can upload BOM files without authentication
- [ ] Header shows "Cont" button (not user avatar)
- [ ] No blocking modals or popups forcing registration
- [ ] All navigation works normally

---

### Test Scenario 6.2: Login Page - Guest Skip Option

**Priority**: Critical

**Estimated Time**: 3 minutes

**Given**: Guest user navigates to /login

**When**: Page loads

**Then**:
- [ ] Login form is displayed with email and password fields
- [ ] "Continuă fără cont" button is prominently displayed
- [ ] Benefits card shows value proposition:
  - ✓ Salvează proiecte BOM pentru reutilizare
  - ✓ Vezi istoricul comenzilor
  - ✓ Pre-completare automată cu datele companiei
- [ ] "Nu ai cont? Creează unul" link is visible
- [ ] "Ai uitat parola?" link is present

**When**: User clicks "Continuă fără cont"

**Then**:
- [ ] User is redirected to home page (/)
- [ ] No account is created
- [ ] User remains in guest state
- [ ] Header still shows "Cont" button

---

### Test Scenario 6.3: Successful Login - Business Account

**Priority**: Critical

**Estimated Time**: 3 minutes

**Given**: User is on /login page with valid business account credentials

**When**: User enters:
- Email: `test@metalpro.ro`
- Password: `password123`
- Clicks "Autentifică-te"

**Then**:
- [ ] Toast notification shows "Autentificare reușită"
- [ ] User is redirected to /account page
- [ ] Header shows user avatar dropdown (company initial or name initial)
- [ ] Avatar dropdown shows:
  - User name
  - User email (smaller text)
  - "Contul Meu" menu item
  - "Proiecte Salvate" menu item
  - "Istoric Comenzi" menu item
  - "Deconectare" in red text
- [ ] "Cont" button is replaced with avatar

---

### Test Scenario 6.4: Login - Validation Errors

**Priority**: High

**Estimated Time**: 4 minutes

**Given**: User is on /login page

**When**: User enters invalid email format (e.g., "notanemail")

**Then**:
- [ ] Form shows validation error: "Email invalid"
- [ ] Submit button remains enabled
- [ ] Error message is displayed in red

**When**: User enters valid email but wrong password

**Then**:
- [ ] Toast notification shows "Email sau parolă greșită"
- [ ] User remains on login page
- [ ] Password field is cleared (security best practice)
- [ ] Email field retains value

**When**: User leaves fields empty and clicks submit

**Then**:
- [ ] Form validation prevents submission
- [ ] Inline errors appear for empty fields

---

### Test Scenario 6.5: Signup Page - Business Account Creation

**Priority**: Critical

**Estimated Time**: 5 minutes

**Given**: Guest user navigates to /signup

**When**: Page loads

**Then**:
- [ ] Account type toggle is visible (Business / Individual)
- [ ] "Business" is selected by default
- [ ] Personal info fields are visible (Name, Email, Phone, Password, Confirm Password)
- [ ] Company info fields are visible (Company Name, CUI, Address, City, County, Postal Code)
- [ ] "Sari peste (continuă fără cont)" button is prominently displayed
- [ ] Benefits card explains account advantages

**When**: User fills form with valid business data:
- Name: "Ion Popescu"
- Email: "new@company.ro"
- Phone: "+40712345678"
- Password: "SecurePass123"
- Confirm Password: "SecurePass123"
- Company Name: "SC Test SRL"
- CUI: "RO12345678"
- Address: "Strada Test nr. 1"
- City: "București"
- County: "București"
- Clicks "Creează Cont"

**Then**:
- [ ] Account is created successfully
- [ ] Toast shows "Cont creat cu succes"
- [ ] User is logged in automatically
- [ ] User is redirected to /account page
- [ ] Header shows user avatar
- [ ] Account page shows all company data filled

---

### Test Scenario 6.6: Signup Page - Individual Account

**Priority**: High

**Estimated Time**: 3 minutes

**Given**: User is on /signup page

**When**: User toggles to "Individual" account type

**Then**:
- [ ] Company info fields are hidden or disabled
- [ ] Only personal info fields are required
- [ ] CUI field is not visible

**When**: User fills personal info and clicks "Creează Cont"

**Then**:
- [ ] Individual account is created
- [ ] User is logged in
- [ ] Account page does NOT show "Company" tab
- [ ] Tabs show: Profile, Addresses, Projects, Orders (no Company tab)

---

### Test Scenario 6.7: Signup - Validation & Skip

**Priority**: High

**Estimated Time**: 4 minutes

**Given**: User is on /signup page

**When**: User enters mismatched passwords

**Then**:
- [ ] Error shown: "Parolele nu coincid"
- [ ] Submit is prevented

**When**: User enters password less than 8 characters

**Then**:
- [ ] Validation error appears
- [ ] Inline message shows minimum length requirement

**When**: User clicks "Sari peste (continuă fără cont)"

**Then**:
- [ ] User redirected to home page (/)
- [ ] No account created
- [ ] User remains guest
- [ ] Can still use all core features

---

### Test Scenario 6.8: Forgot Password Flow

**Priority**: Medium

**Estimated Time**: 3 minutes

**Given**: User is on /login page

**When**: User clicks "Ai uitat parola?"

**Then**:
- [ ] User navigated to /forgot-password
- [ ] Page shows email input field
- [ ] "Trimite link de resetare" button is visible
- [ ] "Înapoi la autentificare" link is present

**When**: User enters valid email and submits

**Then**:
- [ ] Success screen shows: "Email trimis!"
- [ ] Message explains to check inbox
- [ ] "Înapoi la autentificare" button appears
- [ ] "Nu ai primit email? Trimite din nou" link visible

---

### Test Scenario 6.9: Protected Routes - Redirect to Login

**Priority**: Critical

**Estimated Time**: 2 minutes

**Given**: Guest user (not logged in)

**When**: User tries to access /account directly via URL

**Then**:
- [ ] User is redirected to /login
- [ ] URL shows /login (with state preserving /account as return destination)
- [ ] After successful login, user is redirected to /account (not home)

---

### Test Scenario 6.10: Logout Functionality

**Priority**: High

**Estimated Time**: 2 minutes

**Given**: User is logged in

**When**: User clicks avatar dropdown → "Deconectare"

**Then**:
- [ ] Toast shows "Deconectat cu succes"
- [ ] User is redirected to home page (/)
- [ ] Header shows "Cont" button again (guest state)
- [ ] Avatar dropdown is removed
- [ ] Session is cleared (verify by refreshing page - user stays logged out)

---

### Test Scenario 6.11: Account Page - Profile Tab

**Priority**: High

**Estimated Time**: 4 minutes

**Given**: User is logged in and on /account page

**When**: "Profile" tab is selected (default)

**Then**:
- [ ] "Informații Personale" card is visible
- [ ] Email verification badge shows "Email Verificat" (green) or "Email Neverificat" (gray)
- [ ] Name field shows current user name
- [ ] Email field shows current email (disabled - cannot edit)
- [ ] Phone field shows current phone
- [ ] Account type shows "Business" or "Individual" (disabled)
- [ ] "Editează Profil" button is visible

**When**: User clicks "Editează Profil"

**Then**:
- [ ] Name and phone fields become editable
- [ ] "Salvează Modificările" and "Anulează" buttons appear
- [ ] "Editează Profil" button disappears

**When**: User changes name to "Test Updated" and phone to "+40722222222", clicks "Salvează Modificările"

**Then**:
- [ ] Toast shows "Profil actualizat"
- [ ] Fields become read-only again
- [ ] Updated values persist after page refresh
- [ ] Header avatar dropdown shows updated name

---

### Test Scenario 6.12: Account Page - Change Password

**Priority**: High

**Estimated Time**: 3 minutes

**Given**: User is on Profile tab

**When**: User scrolls to "Schimbă Parola" card

**Then**:
- [ ] "Schimbă Parola" button is visible

**When**: User clicks "Schimbă Parola"

**Then**:
- [ ] Current password field appears
- [ ] New password field appears with placeholder "Minim 8 caractere"
- [ ] Confirm new password field appears
- [ ] "Schimbă Parola" and "Anulează" buttons visible

**When**: User enters new password less than 8 characters

**Then**:
- [ ] Error shown: "Parola trebuie să aibă minim 8 caractere"

**When**: User enters valid current password, new password "NewPass123", mismatched confirm

**Then**:
- [ ] Error shown: "Parolele nu coincid"

**When**: User enters matching passwords correctly and submits

**Then**:
- [ ] Toast shows "Parolă schimbată"
- [ ] Form collapses back to "Schimbă Parola" button
- [ ] Fields are cleared

---

### Test Scenario 6.13: Account Page - Company Info Tab (Business Only)

**Priority**: High

**Estimated Time**: 5 minutes

**Given**: User is logged in with business account

**When**: User clicks "Companie" tab

**Then**:
- [ ] "Informații Companie" card visible
- [ ] Company verification badge shows "Companie Verificată" if verified
- [ ] Company name field shows saved value
- [ ] CUI field shows saved CUI
- [ ] Registrul Comerțului field shows regCom (optional)
- [ ] "Editează Date Companie" button visible

**When**: User clicks "Editează Date Companie"

**Then**:
- [ ] All company fields become editable
- [ ] "Salvează Modificările" and "Anulează" buttons appear

**When**: User scrolls to "Adresa Sediului Social" card

**Then**:
- [ ] Address fields show saved company address
- [ ] Fields become editable when edit mode active

**When**: User scrolls to "Verificare Business" card

**Then**:
- [ ] If verified: Shows "Verificat" badge with green checkmark
- [ ] If not verified: Shows "Solicită Verificare (În curând)" button (disabled)
- [ ] Explanation text visible about priority processing

**When**: User updates company data and saves

**Then**:
- [ ] Toast shows "Informații actualizate"
- [ ] Updated data persists after refresh
- [ ] RFQ form auto-fills with new company data

---

### Test Scenario 6.14: Account Page - Saved Addresses Tab

**Priority**: High

**Estimated Time**: 6 minutes

**Given**: User is on Addresses tab with no saved addresses

**When**: Tab loads

**Then**:
- [ ] Empty state shows map pin icon
- [ ] "Nu ai adrese salvate" message displayed
- [ ] "Adaugă Prima Adresă" button visible

**When**: User clicks "Adaugă Adresă" button

**Then**:
- [ ] Dialog opens: "Adaugă Adresă Nouă"
- [ ] Address type radio buttons: "Adresă de Livrare" and "Adresă de Facturare"
- [ ] Label field: "Etichetă (ex: Sediu Principal, Depozit Cluj)"
- [ ] Contact person field
- [ ] Phone field
- [ ] Email field (optional)
- [ ] Address field
- [ ] City field
- [ ] County dropdown with all Romanian counties
- [ ] Postal code field
- [ ] "Setează ca adresă implicită" checkbox
- [ ] "Salvează Adresa" and "Anulează" buttons

**When**: User fills form:
- Type: Delivery
- Label: "Depozit Cluj"
- Contact: "Maria Ionescu"
- Phone: "+40733333333"
- Address: "Str. Test nr. 10"
- City: "Cluj-Napoca"
- County: "Cluj"
- Postal Code: "400001"
- Is Default: Checked
- Clicks "Salvează Adresa"

**Then**:
- [ ] Dialog closes
- [ ] Toast shows "Adresă adăugată"
- [ ] Address card appears in grid
- [ ] Card shows:
  - Label "Depozit Cluj"
  - "Implicită" badge (green)
  - Type: "Livrare"
  - Contact person name
  - Phone number
  - Full address
  - Edit button (pencil icon)
  - Delete button (trash icon)
- [ ] Card has primary border color (indicating default)

**When**: User adds second address (billing, not default)

**Then**:
- [ ] Two address cards visible in grid
- [ ] Only first address has "Implicită" badge
- [ ] Second address shows "Setează ca implicită" link

**When**: User clicks "Setează ca implicită" on second address

**Then**:
- [ ] Toast shows "Adresă implicită actualizată"
- [ ] Second address now shows "Implicită" badge
- [ ] First address loses "Implicită" badge and shows "Setează ca implicită" link
- [ ] Only one default address per type (delivery OR billing)

**When**: User clicks Edit button on an address

**Then**:
- [ ] Dialog opens with "Editează Adresă" title
- [ ] All fields pre-filled with current values
- [ ] County dropdown shows correct selected value

**When**: User changes label to "Depozit Principal Cluj" and saves

**Then**:
- [ ] Dialog closes
- [ ] Toast shows "Adresă actualizată"
- [ ] Card reflects new label immediately

**When**: User clicks Delete button

**Then**:
- [ ] Browser confirmation dialog: "Sigur vrei să ștergi această adresă?"

**When**: User confirms deletion

**Then**:
- [ ] Toast shows "Adresă ștearsă"
- [ ] Address card removed from grid
- [ ] If deleted address was default, no other address becomes default automatically

---

### Test Scenario 6.15: Account Page - Saved Projects Tab

**Priority**: Critical

**Estimated Time**: 5 minutes

**Given**: User is on Projects tab with no saved projects

**When**: Tab loads

**Then**:
- [ ] Empty state shows package icon
- [ ] "Nu ai proiecte salvate" message
- [ ] "Proiectele BOM pe care le salvezi vor apărea aici"
- [ ] "Încarcă un fișier BOM" button links to /bom-upload

**Given**: User has saved BOM projects

**When**: Tab loads with existing projects

**Then**:
- [ ] Projects displayed as cards in vertical list
- [ ] Each card shows:
  - File icon + project name
  - Description (if provided)
  - Badge with row count (e.g., "25 rânduri")
  - Created date: "Creat: DD.MM.YYYY"
  - Last used date (if used): "Ultima folosire: DD.MM.YYYY"
  - Original file name: "Fișier original: filename.csv"
  - "Încarcă în Coș" button (shopping cart icon)
  - Delete button (trash icon)

**When**: User clicks "Încarcă în Coș" on a saved project

**Then**:
- [ ] Toast shows "Proiectul '{name}' a fost încărcat în pagina BOM"
- [ ] User navigated to /bom-upload
- [ ] BOM Mapper shows loaded project data
- [ ] All rows from saved project appear in table
- [ ] File name shows original uploaded file name
- [ ] Matched products are preserved
- [ ] Manual mappings are preserved
- [ ] Project's "Last used" timestamp updates

**When**: User clicks Delete button on project

**Then**:
- [ ] Confirmation dialog: "Sigur vrei să ștergi acest proiect?"

**When**: User confirms deletion

**Then**:
- [ ] Toast shows "Proiect șters"
- [ ] Project card removed from list

---

### Test Scenario 6.16: Account Page - Order History Tab

**Priority**: High

**Estimated Time**: 5 minutes

**Given**: User is on Orders tab with no order history

**When**: Tab loads

**Then**:
- [ ] Empty state shows package icon
- [ ] "Nu ai comenzi trimise" message
- [ ] "Cererile de ofertă (RFQ) pe care le trimiți vor apărea aici"

**Given**: User has submitted RFQs

**When**: Tab loads with order history

**Then**:
- [ ] Orders displayed as expandable cards
- [ ] Each card shows:
  - Order number (e.g., "Cerere Ofertă #12345")
  - Company name from RFQ
  - Status badge (Trimis, Confirmat, În Procesare, Ofertă Primită, Finalizat, Anulat)
  - Submitted date and time
  - Product count (e.g., "5 produse")
  - Quote value if quoted (e.g., "Valoare ofertă: 15,000 RON")
  - "Vezi Detalii" / "Ascunde Detalii" button

**When**: User clicks "Vezi Detalii" on an order

**Then**:
- [ ] Card expands to show:
  - **Informații Companie**: Name, CUI, Contact, Email, Phone
  - **Adresă Livrare**: Full delivery address, desired delivery date
  - **Produse**: List of all cart items with specs
  - **Cerințe Speciale**: Special requirements text (if provided)
  - **Detalii Ofertă** (if quoted): Total price, currency, valid until date, notes

**When**: User clicks "Ascunde Detalii"

**Then**:
- [ ] Card collapses back to summary view

**When**: Status badge colors are verified

**Then**:
- [ ] "Trimis" = gray/secondary
- [ ] "Confirmat" = outline
- [ ] "În Procesare" = blue/default
- [ ] "Ofertă Primită" = blue/default
- [ ] "Finalizat" = green/default
- [ ] "Anulat" = red/destructive

---

### Test Scenario 6.17: RFQ Form Auto-Prefill (Logged In User)

**Priority**: Critical

**Estimated Time**: 4 minutes

**Given**: User is logged in with business account containing:
- Company name: "SC MetalPro SRL"
- CUI: "RO12345678"
- Address: "Str. Industriei nr. 5"
- City: "București"
- County: "București"
- Postal Code: "012345"
- Name: "Ion Popescu"
- Phone: "+40712345678"
- Email: "ion@metalpro.ro"

**When**: User navigates to /rfq (RFQ form)

**Then**:
- [ ] Company Info step shows blue info alert:
  - "Datele au fost pre-completate din contul tău. Poți edita orice câmp înainte de a continua."
- [ ] All fields auto-filled:
  - Legal Name: "SC MetalPro SRL"
  - CUI/VAT: "RO12345678"
  - Street: "Str. Industriei nr. 5"
  - City: "București"
  - County: "București" (selected in dropdown)
  - Postal Code: "012345"
  - Contact Person: "Ion Popescu"
  - Phone: "+40712345678"
  - Email: "ion@metalpro.ro"
- [ ] All fields remain editable
- [ ] If company is verified, CUI validation shows "CUI verificat din contul tău" (green success)

**When**: User edits a pre-filled field (e.g., changes phone number)

**Then**:
- [ ] Field value updates
- [ ] Change does NOT update account data (only for this RFQ)
- [ ] User can proceed with modified data

**When**: Guest user (not logged in) navigates to /rfq

**Then**:
- [ ] NO blue info alert shown
- [ ] ALL fields are empty
- [ ] User must manually enter all company data
- [ ] No auto-fill occurs

---

### Test Scenario 6.18: BOM Upload - Save Project (Logged In)

**Priority**: Critical

**Estimated Time**: 5 minutes

**Given**: User is logged in and has uploaded BOM file with processed rows

**When**: BOM Mapper displays with matched rows

**Then**:
- [ ] "Salvează Proiect" button visible in card header (outline variant)
- [ ] Button shows save icon + "Salvează Proiect" text
- [ ] Button positioned next to "Adaugă în Coș" button

**When**: User clicks "Salvează Proiect"

**Then**:
- [ ] Browser prompt appears: "Introdu un nume pentru acest proiect BOM:"

**When**: User enters project name: "Comandă Hală Industrială"

**Then**:
- [ ] Second prompt appears: "Descriere opțională (poți lăsa gol):"

**When**: User enters description: "Structură metalică pentru hala de producție"

**Then**:
- [ ] Project saved to user's account
- [ ] Toast shows "Proiect salvat" with project name
- [ ] BOM data remains in mapper (not cleared)
- [ ] User can continue editing or add to cart

**When**: User cancels project name prompt (clicks Cancel)

**Then**:
- [ ] Save operation cancelled
- [ ] No project created
- [ ] No toast shown
- [ ] BOM Mapper remains unchanged

**When**: User navigates to Account → Projects tab

**Then**:
- [ ] Saved project appears in list
- [ ] Shows: name, description, row count, created date, file name

---

### Test Scenario 6.19: BOM Upload - Save Project Prompt (Guest User)

**Priority**: High

**Estimated Time**: 3 minutes

**Given**: Guest user (not logged in) has uploaded BOM file

**When**: BOM Mapper displays

**Then**:
- [ ] "Salvează Proiect" button is still visible (not hidden)

**When**: Guest user clicks "Salvează Proiect"

**Then**:
- [ ] Toast shows "Autentificare necesară" (destructive/red)
- [ ] Description: "Trebuie să fii autentificat pentru a salva proiecte BOM."
- [ ] User redirected to /login page
- [ ] After successful login, user NOT automatically returned to BOM page (standard login flow)

---

### Test Scenario 6.20: Account Navigation - Header Dropdown

**Priority**: High

**Estimated Time**: 3 minutes

**Given**: User is logged in

**When**: User clicks avatar in header

**Then**:
- [ ] Dropdown menu opens
- [ ] Shows user name (bold)
- [ ] Shows email (smaller, muted text)
- [ ] Separator line
- [ ] "Contul Meu" menu item (user icon)
- [ ] "Proiecte Salvate" menu item (package icon, disabled)
- [ ] "Istoric Comenzi" menu item (history icon, disabled)
- [ ] Separator line
- [ ] "Deconectare" menu item (red text, logout icon)

**When**: User clicks "Contul Meu"

**Then**:
- [ ] User navigated to /account
- [ ] Dropdown closes

**When**: User clicks outside dropdown

**Then**:
- [ ] Dropdown closes

---

### Test Scenario 6.21: Responsive Design - Account Tabs (Mobile)

**Priority**: High

**Estimated Time**: 4 minutes

**Given**: User logged in on mobile device (viewport < 640px)

**When**: User navigates to /account

**Then**:
- [ ] Tabs render in 2-column grid (not 5 columns)
- [ ] Tab labels hide text, show only icons
- [ ] "Deconectare" button shows only logout icon (no text)
- [ ] Email verification badge hidden on mobile

**When**: User clicks a tab

**Then**:
- [ ] Tab content displays correctly
- [ ] Address cards stack vertically (not 2-column grid)
- [ ] All forms remain usable
- [ ] Dialogs use full screen on mobile

---

### Test Scenario 6.22: Session Persistence - Page Refresh

**Priority**: High

**Estimated Time**: 2 minutes

**Given**: User is logged in

**When**: User refreshes the page (F5 or Cmd+R)

**Then**:
- [ ] User remains logged in
- [ ] Header still shows avatar dropdown
- [ ] Account data persists
- [ ] No re-login required

**When**: User closes browser tab and reopens application

**Then**:
- [ ] User remains logged in (localStorage session)
- [ ] All account data accessible

---

### Test Scenario 6.23: Account Tab Visibility - Business vs Individual

**Priority**: Medium

**Estimated Time**: 2 minutes

**Given**: User logged in with Individual account

**When**: User navigates to /account

**Then**:
- [ ] Tabs show: Profile, Addresses, Projects, Orders (4 tabs)
- [ ] "Company" tab is NOT visible
- [ ] Tab grid adjusts to 4 columns (or 2x2 on mobile)

**Given**: User logged in with Business account

**When**: User navigates to /account

**Then**:
- [ ] Tabs show: Profile, Company, Addresses, Projects, Orders (5 tabs)
- [ ] "Company" tab visible between Profile and Addresses
- [ ] Clicking "Company" tab shows company info form

---

### Test Scenario 6.24: End-to-End - Guest to Registered User Journey

**Priority**: Critical

**Estimated Time**: 10 minutes

**Given**: New guest user

**When**: User workflow:
1. Browse catalog → add products to cart
2. Navigate to /rfq → manually enter company data
3. Submit RFQ
4. Upload BOM file → try to save project → redirected to login
5. Create account on /signup
6. Login successful → redirected to /account

**Then**:
- [ ] User successfully created account
- [ ] Account page shows profile data
- [ ] Cart items from guest session preserved after login
- [ ] User can now save BOM projects
- [ ] RFQ form pre-fills on next visit
- [ ] Previous RFQ NOT in order history (submitted as guest)

---

### Test Scenario 6.25: Data Persistence - LocalStorage

**Priority**: Medium

**Estimated Time**: 3 minutes

**Given**: User has:
- Created account
- Saved 2 addresses
- Saved 1 BOM project
- Submitted 1 RFQ (as logged-in user)

**When**: Developer opens browser DevTools → Application → Local Storage

**Then**:
- [ ] `metalpro_users` key contains user account data
- [ ] `metalpro_addresses` key contains saved addresses
- [ ] `metalpro_projects` key contains saved projects
- [ ] `metalpro_order_history` key contains RFQ submission
- [ ] `metalpro_auth_session` key contains current session token

**When**: User logs out

**Then**:
- [ ] `metalpro_auth_session` is removed
- [ ] User data remains in localStorage (but session cleared)

---

## Phase 6 Summary - Quick Checklist

### Phase 6A: Optional Authentication (11 scenarios)
- [ ] 6.1: Guest access to core features
- [ ] 6.2: Login page with skip option
- [ ] 6.3: Successful login (business)
- [ ] 6.4: Login validation errors
- [ ] 6.5: Signup - business account
- [ ] 6.6: Signup - individual account
- [ ] 6.7: Signup validation & skip
- [ ] 6.8: Forgot password flow
- [ ] 6.9: Protected routes redirect
- [ ] 6.10: Logout functionality
- [ ] 6.20: Header dropdown navigation

### Phase 6B: Account Benefits (14 scenarios)
- [ ] 6.11: Profile tab - edit profile
- [ ] 6.12: Profile tab - change password
- [ ] 6.13: Company info tab (business only)
- [ ] 6.14: Saved addresses CRUD
- [ ] 6.15: Saved projects tab
- [ ] 6.16: Order history tab
- [ ] 6.17: RFQ form auto-prefill
- [ ] 6.18: BOM save project (logged in)
- [ ] 6.19: BOM save project prompt (guest)
- [ ] 6.21: Responsive design - mobile
- [ ] 6.22: Session persistence
- [ ] 6.23: Tab visibility (business vs individual)
- [ ] 6.24: End-to-end guest to user journey
- [ ] 6.25: Data persistence (localStorage)

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
| 6.1 - Guest Access All Features | ⬜ Pass ⬜ Fail | |
| 6.2 - Login Guest Skip Option | ⬜ Pass ⬜ Fail | |
| 6.3 - Successful Login Business | ⬜ Pass ⬜ Fail | |
| 6.4 - Login Validation Errors | ⬜ Pass ⬜ Fail | |
| 6.5 - Signup Business Account | ⬜ Pass ⬜ Fail | |
| 6.6 - Signup Individual Account | ⬜ Pass ⬜ Fail | |
| 6.7 - Signup Validation & Skip | ⬜ Pass ⬜ Fail | |
| 6.8 - Forgot Password Flow | ⬜ Pass ⬜ Fail | |
| 6.9 - Protected Routes Redirect | ⬜ Pass ⬜ Fail | |
| 6.10 - Logout Functionality | ⬜ Pass ⬜ Fail | |
| 6.11 - Profile Tab Edit | ⬜ Pass ⬜ Fail | |
| 6.12 - Change Password | ⬜ Pass ⬜ Fail | |
| 6.13 - Company Info Tab | ⬜ Pass ⬜ Fail | |
| 6.14 - Saved Addresses CRUD | ⬜ Pass ⬜ Fail | |
| 6.15 - Saved Projects Tab | ⬜ Pass ⬜ Fail | |
| 6.16 - Order History Tab | ⬜ Pass ⬜ Fail | |
| 6.17 - RFQ Form Auto-Prefill | ⬜ Pass ⬜ Fail | |
| 6.18 - BOM Save Project Logged In | ⬜ Pass ⬜ Fail | |
| 6.19 - BOM Save Project Guest | ⬜ Pass ⬜ Fail | |
| 6.20 - Header Dropdown Nav | ⬜ Pass ⬜ Fail | |
| 6.21 - Responsive Account Tabs | ⬜ Pass ⬜ Fail | |
| 6.22 - Session Persistence | ⬜ Pass ⬜ Fail | |
| 6.23 - Tab Visibility Business vs Individual | ⬜ Pass ⬜ Fail | |
| 6.24 - Guest to User Journey | ⬜ Pass ⬜ Fail | |
| 6.25 - Data Persistence localStorage | ⬜ Pass ⬜ Fail | |

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

## Phase 7: Search Optimization & Advanced Filtering

### Test Scenario 7.1: Faceted Filters - Basic Display

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User is on the catalog page (/catalog)

**When**: User views the left sidebar filter panel

**Then**:
- [ ] "Filtrează" heading is visible
- [ ] Result count shows "X produse găsite"
- [ ] Filter sections are displayed:
  - [ ] Categorie Produse (Product Family)
  - [ ] Grad Material (Grade)
  - [ ] Standard
  - [ ] Disponibilitate (Availability)
- [ ] Each filter section has a chevron icon (up/down)
- [ ] Some sections are open by default (family, grade, availability)
- [ ] Each filter option shows a count badge on the right

---

### Test Scenario 7.2: Faceted Filters - Multi-Select Checkboxes

**Priority**: Critical
**Estimated Time**: 4 minutes

**Given**: User is on the catalog page with products visible

**When**: User clicks checkbox "Profile" in "Categorie Produse"

**Then**:
- [ ] Checkbox becomes checked
- [ ] Product grid updates to show only profiles
- [ ] Result count updates to show filtered count
- [ ] URL updates with `?family=profiles`
- [ ] Filter chip appears below filters showing "Categorie: Profile"

**When**: User additionally clicks checkbox "Table" in "Categorie Produse"

**Then**:
- [ ] Both "Profile" and "Table" checkboxes are checked
- [ ] Product grid shows both profiles AND plates
- [ ] URL updates to `?family=profiles,plates`
- [ ] Two filter chips appear: "Categorie: Profile" and "Categorie: Table"

**When**: User unchecks "Profile"

**Then**:
- [ ] Only "Table" checkbox remains checked
- [ ] Product grid shows only plates
- [ ] URL updates to `?family=plates`
- [ ] Only one filter chip remains: "Categorie: Table"

---

### Test Scenario 7.3: Faceted Filters - Grade Filter with Scroll

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User is on the catalog page

**When**: User clicks to expand "Grad Material" section

**Then**:
- [ ] Section expands to show grade options
- [ ] Checkboxes are displayed for each grade (S235JR, S355J2, etc.)
- [ ] Each option shows a count badge
- [ ] If more than 10 grades, section has scroll (max-height with overflow)

**When**: User selects "S235JR" and "S355J2"

**Then**:
- [ ] Both checkboxes are checked
- [ ] Product grid filters to show only products with those grades
- [ ] URL updates with `?grade=S235JR,S355J2`
- [ ] Two filter chips appear for the selected grades

---

### Test Scenario 7.4: Faceted Filters - Range Sliders (Price)

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User is on the catalog page with products that have prices

**When**: User expands "Interval Preț" (Price Range) section

**Then**:
- [ ] Dual-handle range slider is visible
- [ ] Min price displays below left handle
- [ ] Max price displays below right handle
- [ ] Initial range shows full price range of available products

**When**: User drags the left handle to increase minimum price to 100 RON

**Then**:
- [ ] Left handle moves to new position
- [ ] Display updates to show "100 RON"
- [ ] Product grid filters to show products >= 100 RON
- [ ] URL updates with `?minPrice=100`
- [ ] Filter chip appears: "Preț: min 100 RON"

**When**: User drags the right handle to decrease maximum price to 500 RON

**Then**:
- [ ] Right handle moves to new position
- [ ] Display updates to show "500 RON"
- [ ] Product grid filters to show products >= 100 AND <= 500 RON
- [ ] URL updates to `?minPrice=100&maxPrice=500`
- [ ] Filter chip updates to: "Preț: 100-500 RON"

---

### Test Scenario 7.5: Faceted Filters - Dimension Range Sliders

**Priority**: Medium
**Estimated Time**: 4 minutes

**Given**: User is on catalog with products that have dimensions (thickness, width, length)

**When**: User expands a dimension filter section (e.g., "Thickness (mm)")

**Then**:
- [ ] Dual-handle range slider is visible
- [ ] Min and max values display in mm
- [ ] Initial range covers all available values for that dimension

**When**: User adjusts thickness slider to 5-20mm range

**Then**:
- [ ] Slider handles move to specified positions
- [ ] Display shows "5 mm" and "20 mm"
- [ ] Product grid filters to products with thickness 5-20mm
- [ ] URL updates with `?minDim_thickness=5&maxDim_thickness=20`
- [ ] Filter chip appears: "thickness: 5-20mm"

**When**: User adjusts multiple dimension sliders (thickness + width)

**Then**:
- [ ] All dimension filters are applied (AND logic)
- [ ] Multiple dimension chips appear
- [ ] URL contains all dimension parameters

---

### Test Scenario 7.6: Faceted Filters - Clear All Functionality

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User has applied multiple filters:
- Family: profiles, plates
- Grade: S235JR
- Price: 100-500 RON
- Availability: in_stock

**When**: User views the filter panel header

**Then**:
- [ ] "Șterge Tot (X)" button is visible (X = active filter count)
- [ ] Active filter count is accurate

**When**: User clicks "Șterge Tot" button

**Then**:
- [ ] All checkboxes become unchecked
- [ ] All range sliders reset to full range
- [ ] Product grid shows all products
- [ ] All filter chips disappear
- [ ] URL clears all filter parameters (only `?page=1` remains)
- [ ] Result count shows total product count

---

### Test Scenario 7.7: Filter Chips - Display and Removal

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User is on catalog page with no filters applied

**When**: User applies filters (family: profiles, grade: S235JR, search: "UNP")

**Then**:
- [ ] Filter chips section appears above product grid
- [ ] Label "Filtre active:" is visible
- [ ] Three filter chips are displayed:
  - "Categorie: Profile Metalice"
  - "Grad: S235JR"
  - "Căutare: \"UNP\""
- [ ] Each chip has an X close button
- [ ] "Șterge toate" button appears (if > 1 chip)

**When**: User clicks X button on "Grad: S235JR" chip

**Then**:
- [ ] That specific chip disappears
- [ ] Grade filter is removed from sidebar
- [ ] Product grid updates to remove grade filter
- [ ] URL updates (removes `grade=S235JR`)
- [ ] Other filters remain active

**When**: User clicks "Șterge toate" button

**Then**:
- [ ] All filter chips disappear
- [ ] All filters are cleared
- [ ] Product grid shows all products
- [ ] URL resets to clean state

---

### Test Scenario 7.8: Advanced Search Modal - Open and Close

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: User is on the catalog page

**When**: User looks at the results header area

**Then**:
- [ ] "Căutare Avansată" button is visible
- [ ] Button has a sliders icon
- [ ] Button is positioned near the product count

**When**: User clicks "Căutare Avansată" button

**Then**:
- [ ] Modal dialog opens
- [ ] Modal title shows "Căutare Avansată" with search icon
- [ ] Modal description: "Construiește o căutare complexă folosind multiple criterii"
- [ ] Modal has scrollable content area
- [ ] Background is dimmed/blurred

**When**: User clicks outside the modal or presses ESC key

**Then**:
- [ ] Modal closes
- [ ] User returns to catalog page
- [ ] No filters are applied (if not clicked "Aplică Căutarea")

---

### Test Scenario 7.9: Advanced Search Modal - Search Text Input

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User has opened the advanced search modal

**When**: User views the search section

**Then**:
- [ ] Search input field is visible
- [ ] Label: "Caută în titlu, SKU, descriere"
- [ ] Placeholder: "Ex: Profile UNP, S235JR, etc."

**When**: User types "UNP 100" in the search field

**Then**:
- [ ] Text appears in the input field
- [ ] Input field shows current text value

**When**: User types and then applies search

**Then**:
- [ ] Search text is included in filters
- [ ] Products are filtered by search term

---

### Test Scenario 7.10: Advanced Search Modal - Category Selection

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User has opened the advanced search modal

**When**: User views "Categorie Produse" section

**Then**:
- [ ] Six category checkboxes are visible:
  - Profile
  - Table
  - Țevi
  - Elemente de Fixare
  - Inox
  - Neferoase
- [ ] Checkboxes are arranged in grid (2-3 columns)

**When**: User selects "Profile" and "Table" checkboxes

**Then**:
- [ ] Both checkboxes show as checked
- [ ] "Filtre Curente" section updates to show selected categories

**When**: User unchecks "Profile"

**Then**:
- [ ] "Profile" checkbox becomes unchecked
- [ ] Only "Table" remains selected
- [ ] "Filtre Curente" section updates

---

### Test Scenario 7.11: Advanced Search Modal - Grade and Standard Selection

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User has opened the advanced search modal

**When**: User views "Grad Material" section

**Then**:
- [ ] Grade checkboxes are displayed in grid layout
- [ ] If many grades available, section has scroll (max-height)
- [ ] All available grades from products are shown

**When**: User selects multiple grades (e.g., S235JR, S355J2, S275JR)

**Then**:
- [ ] All selected checkboxes show as checked
- [ ] "Filtre Curente" section shows: "Grad: S235JR, S355J2, S275JR"

**When**: User scrolls to "Standard" section and selects standards

**Then**:
- [ ] Standard checkboxes work similarly to grades
- [ ] Multiple standards can be selected
- [ ] "Filtre Curente" updates with standard selections

---

### Test Scenario 7.12: Advanced Search Modal - Availability Filter

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: User has opened the advanced search modal

**When**: User views "Disponibilitate" section

**Then**:
- [ ] Three availability checkboxes are visible:
  - În Stoc
  - La Comandă
  - Comandă Viitoare
- [ ] Checkboxes are arranged in grid

**When**: User selects "În Stoc" and "La Comandă"

**Then**:
- [ ] Both checkboxes show as checked
- [ ] "Filtre Curente" shows: "Disponibilitate: În Stoc, La Comandă"

---

### Test Scenario 7.13: Advanced Search Modal - Current Filter Summary

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: User has selected multiple filters in the advanced search modal:
- Categories: Profile, Table
- Grades: S235JR
- Availability: În Stoc
- Search: "UNP"

**When**: User scrolls to "Filtre Curente" section

**Then**:
- [ ] Section is visible with gray background
- [ ] Human-readable filter description is displayed
- [ ] Description includes all selected filters separated by " | "
- [ ] Example: "Categorie: profiles, plates | Grad: S235JR | Disponibilitate: in_stock | Căutare: \"UNP\""

**When**: User adds or removes a filter

**Then**:
- [ ] "Filtre Curente" section updates immediately
- [ ] All active filters are reflected in the description

---

### Test Scenario 7.14: Advanced Search Modal - Apply Search

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User has selected filters in advanced search modal

**When**: User clicks "Aplică Căutarea" button

**Then**:
- [ ] Modal closes
- [ ] Catalog page shows filtered products
- [ ] All selected filters are applied to product grid
- [ ] Filter chips appear for all active filters
- [ ] Sidebar filters reflect the applied selections
- [ ] URL updates with all filter parameters
- [ ] Toast notification appears: "Filtre aplicate" with filter description

**When**: User has no filters selected and clicks "Aplică Căutarea"

**Then**:
- [ ] Button is disabled (or does nothing)
- [ ] User cannot apply empty search

---

### Test Scenario 7.15: Advanced Search Modal - Clear Filters

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: User has multiple filters selected in advanced search modal

**When**: User clicks "Șterge Tot" button

**Then**:
- [ ] All checkboxes become unchecked
- [ ] Search text input is cleared
- [ ] "Filtre Curente" section disappears or shows "Fără filtre"
- [ ] Modal remains open

**When**: User clicks "Anulează" button

**Then**:
- [ ] Modal closes
- [ ] No filters are applied to catalog
- [ ] User returns to previous filter state

---

### Test Scenario 7.16: Saved Searches - Save New Search (Authenticated User)

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User is logged in and has filters selected in advanced search modal:
- Category: profiles
- Grade: S235JR
- Availability: in_stock

**When**: User clicks "Salvează" button

**Then**:
- [ ] Save search form appears
- [ ] Input field is shown: "Nume Căutare"
- [ ] Placeholder: "Ex: Profile S235JR în stoc"
- [ ] "Salvează" and "Anulează" buttons are visible

**When**: User enters name "Profile S235JR Standard" and clicks "Salvează"

**Then**:
- [ ] Toast notification: "Căutare salvată: Profile S235JR Standard"
- [ ] Save form disappears
- [ ] Search is saved to localStorage with user ID
- [ ] "Căutări Salvate" section appears (if not already visible)
- [ ] New saved search appears in the list

**When**: User tries to save search with empty name

**Then**:
- [ ] Toast error: "Nume lipsă: Te rugăm să introduci un nume pentru căutare"
- [ ] Search is not saved

**When**: User tries to save duplicate filters (same filters already saved)

**Then**:
- [ ] Toast error: "Căutare existentă: O căutare similară există deja: [name]"
- [ ] Search is not saved

---

### Test Scenario 7.17: Saved Searches - Load Saved Search

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User is logged in and has saved searches in localStorage

**When**: User opens advanced search modal and views "Căutări Salvate" section

**Then**:
- [ ] Section header shows star icon and "Căutări Salvate" label
- [ ] List of saved searches is displayed
- [ ] Each saved search shows:
  - Search name
  - Filter description (small gray text)
  - Delete button (trash icon)
- [ ] List has scroll if more than 5 saved searches

**When**: User clicks on a saved search item

**Then**:
- [ ] All filters from that search are loaded
- [ ] Checkboxes update to reflect saved filters
- [ ] Search text input updates if search term was saved
- [ ] "Filtre Curente" section shows loaded filters
- [ ] Toast notification: "Căutare încărcată: [search name]"

---

### Test Scenario 7.18: Saved Searches - Delete Saved Search

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: User has saved searches and is viewing them in the modal

**When**: User clicks trash icon on a saved search

**Then**:
- [ ] Saved search is removed from the list
- [ ] Toast notification: "Căutare ștearsă: [search name]"
- [ ] localStorage is updated (search removed)
- [ ] If no more saved searches, section may hide or show empty state

---

### Test Scenario 7.19: Recent Searches - Display and Load

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: User has performed several searches in the past

**When**: User opens advanced search modal

**Then**:
- [ ] "Căutări Recente" section is visible (if recent searches exist)
- [ ] Section header shows clock icon and label
- [ ] Up to 5 most recent searches are displayed
- [ ] Each recent search shows filter description (gray text)
- [ ] Searches are clickable buttons

**When**: User clicks on a recent search

**Then**:
- [ ] Filters from that search are loaded into modal
- [ ] All checkboxes and inputs update
- [ ] "Filtre Curente" shows loaded filters
- [ ] Toast notification: "Căutare încărcată: Căutarea recentă a fost încărcată"

**When**: User applies a search

**Then**:
- [ ] That search is automatically added to recent searches
- [ ] Recent searches list updates (most recent appears first)
- [ ] If more than 10 recent searches, oldest is removed
- [ ] Recent searches are stored in localStorage with user ID

---

### Test Scenario 7.20: Saved Searches - Guest User Behavior

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: User is NOT logged in

**When**: User opens advanced search modal with filters selected

**Then**:
- [ ] "Salvează" button is NOT visible
- [ ] "Căutări Salvate" section is NOT visible
- [ ] User cannot save searches

**When**: User applies filters

**Then**:
- [ ] Filters are applied normally
- [ ] Recent searches still work (localStorage with guest ID)
- [ ] "Căutări Recente" section shows recent guest searches

---

### Test Scenario 7.21: URL Persistence - Share Filtered URL

**Priority**: Critical
**Estimated Time**: 4 minutes

**Given**: User has applied multiple filters:
- Family: profiles
- Grade: S235JR, S355J2
- Availability: in_stock
- Price: 100-500 RON
- Search: "UNP"

**When**: User copies the current URL from browser address bar

**Then**:
- [ ] URL contains all filter parameters:
  - `?family=profiles`
  - `&grade=S235JR,S355J2`
  - `&availability=in_stock`
  - `&minPrice=100&maxPrice=500`
  - `&search=UNP`
- [ ] Parameters are properly encoded

**When**: User pastes this URL in a new browser tab/window

**Then**:
- [ ] Page loads with all filters applied
- [ ] Product grid shows filtered results
- [ ] Filter chips display all active filters
- [ ] Sidebar filters reflect the URL parameters:
  - Checkboxes are checked
  - Range sliders show correct positions
- [ ] Search term is not visible in UI (only in filter chip)

**When**: User shares URL with another user (or different browser)

**Then**:
- [ ] Other user sees the same filtered view
- [ ] All filters are applied correctly
- [ ] Product count matches

---

### Test Scenario 7.22: URL Persistence - Filter Changes Update URL

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User is on catalog page

**When**: User selects a filter (e.g., Family: profiles)

**Then**:
- [ ] URL immediately updates to include `?family=profiles`
- [ ] Browser history is updated (back button will work)
- [ ] Page does NOT reload (SPA behavior)

**When**: User selects another filter (e.g., Grade: S235JR)

**Then**:
- [ ] URL updates to include both: `?family=profiles&grade=S235JR`
- [ ] Order of parameters is consistent

**When**: User removes a filter

**Then**:
- [ ] URL updates to remove that parameter
- [ ] Other parameters remain
- [ ] If last filter removed, URL becomes clean `/catalog`

**When**: User uses browser back button

**Then**:
- [ ] Filters revert to previous state
- [ ] Product grid updates
- [ ] Filter UI updates (checkboxes, sliders)

---

### Test Scenario 7.23: Filter Counts - Dynamic Badge Updates

**Priority**: Medium
**Estimated Time**: 4 minutes

**Given**: User is on catalog page with 100 total products

**When**: User views faceted filters sidebar

**Then**:
- [ ] Each filter option shows a count badge
- [ ] Badge shows number of products matching that filter
- [ ] Example: "Profile (45)" means 45 products are profiles

**When**: User selects "Profile" category filter

**Then**:
- [ ] Product grid filters to 45 profiles
- [ ] Filter badges update to show counts WITHIN profiles:
  - Grade badges show counts of grades within profiles
  - Standard badges show counts of standards within profiles
  - Availability badges show counts within profiles
- [ ] Total result count shows "45 produse găsite"

**When**: User additionally selects "S235JR" grade

**Then**:
- [ ] Product grid filters further (e.g., 12 products)
- [ ] All filter badges update again
- [ ] Badges show counts for profiles AND S235JR
- [ ] Some filter options may show count (0) if no products match

**Note**: In current implementation, badges may show counts from current page only, not full dataset. Document actual behavior.

---

### Test Scenario 7.24: Filter Collapsible Sections

**Priority**: Low
**Estimated Time**: 3 minutes

**Given**: User is on catalog page

**When**: User views the faceted filters sidebar

**Then**:
- [ ] Some filter sections are open by default (family, grade, availability)
- [ ] Other sections are closed by default
- [ ] Each section has a chevron icon:
  - Down chevron when collapsed
  - Up chevron when expanded

**When**: User clicks on a collapsed section header (e.g., "Standard")

**Then**:
- [ ] Section expands smoothly
- [ ] Chevron icon changes from down to up
- [ ] Filter options become visible

**When**: User clicks on an expanded section header

**Then**:
- [ ] Section collapses smoothly
- [ ] Chevron icon changes from up to down
- [ ] Filter options are hidden
- [ ] Selected filters remain active (collapsing doesn't remove them)

**When**: User collapses a section with active filters

**Then**:
- [ ] Section collapses but filters remain applied
- [ ] Product grid stays filtered
- [ ] Filter chips remain visible

---

### Test Scenario 7.25: Combination Filters - Complex Scenarios

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User is on catalog with diverse product set

**When**: User applies multiple filter types simultaneously:
1. Family: profiles, plates
2. Grade: S235JR
3. Availability: in_stock
4. Price range: 50-300 RON
5. Thickness: 5-15mm
6. Search: "UNP"

**Then**:
- [ ] All filters are applied with AND logic
- [ ] Product grid shows only products matching ALL criteria:
  - (profiles OR plates) AND
  - (S235JR) AND
  - (in_stock) AND
  - (price 50-300) AND
  - (thickness 5-15mm) AND
  - (contains "UNP" in title/SKU/description)
- [ ] Multiple filter chips appear for all filters
- [ ] URL contains all filter parameters
- [ ] Result count reflects fully filtered set

**When**: User removes one filter (e.g., search term)

**Then**:
- [ ] Product grid expands to include more products
- [ ] Result count increases
- [ ] Other filters remain active
- [ ] URL updates to remove only that parameter

---

### Test Scenario 7.26: Pagination with Filters

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User has filters applied that result in 50 products (12 per page = 5 pages)

**When**: User is on page 3 of filtered results

**Then**:
- [ ] URL shows `?family=profiles&page=3`
- [ ] Products 25-36 are displayed
- [ ] Pagination shows "Page 3 of 5"

**When**: User adds or removes a filter

**Then**:
- [ ] User is automatically reset to page 1
- [ ] URL updates to `?family=profiles,plates&page=1`
- [ ] First 12 products of new filtered set are shown
- [ ] Pagination updates to reflect new total pages

**When**: User applies filters that result in fewer than 12 products

**Then**:
- [ ] All products are shown on page 1
- [ ] Pagination component may hide or show "Page 1 of 1"

---

### Test Scenario 7.27: Sort with Filters

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User has filters applied

**When**: User changes sort order to "Preț (Crescător)"

**Then**:
- [ ] Filtered products are sorted by price ascending
- [ ] Filters remain active
- [ ] URL updates: `?family=profiles&sort=price-asc`
- [ ] Page resets to 1

**When**: User changes sort to "Nume (A-Z)"

**Then**:
- [ ] Filtered products are sorted alphabetically
- [ ] Filters remain active
- [ ] URL updates sort parameter
- [ ] Product order changes

**When**: User changes sort back to "Implicit"

**Then**:
- [ ] Sort parameter is removed from URL
- [ ] Products return to default order
- [ ] Filters remain active

---

### Test Scenario 7.28: Advanced Search Modal - Enter Key Behavior

**Priority**: Low
**Estimated Time**: 2 minutes

**Given**: User has advanced search modal open

**When**: User types in search text input and presses Enter key

**Then**:
- [ ] Modal does NOT close
- [ ] Search is not automatically applied
- [ ] User must click "Aplică Căutarea" button

**When**: User is in save search name input and presses Enter

**Then**:
- [ ] Search is saved (same as clicking "Salvează")
- [ ] Save form closes
- [ ] Toast notification appears

---

### Test Scenario 7.29: Filter Persistence - Browser Refresh

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: User has applied filters with URL: `?family=profiles&grade=S235JR`

**When**: User refreshes the browser (F5 or Cmd+R)

**Then**:
- [ ] Page reloads with same filters applied
- [ ] Product grid shows filtered results
- [ ] Filter chips are displayed
- [ ] Sidebar filters show correct selections
- [ ] URL parameters are unchanged

---

### Test Scenario 7.30: Mobile Responsiveness - Filters

**Priority**: Medium
**Estimated Time**: 4 minutes

**Given**: User is on mobile device (375px width)

**When**: User views catalog page

**Then**:
- [ ] Filter sidebar may be hidden or collapsed on mobile
- [ ] "Filters" button or icon is visible to open filters
- [ ] Advanced search button is visible and accessible
- [ ] Filter chips wrap to multiple rows if needed

**When**: User opens filters on mobile

**Then**:
- [ ] Filters open as overlay/drawer or push content
- [ ] All filter options are accessible
- [ ] Checkboxes are large enough to tap (min 44x44px)
- [ ] Range sliders are draggable on touch

**When**: User opens advanced search modal on mobile

**Then**:
- [ ] Modal is full-screen or near full-screen
- [ ] All sections are scrollable
- [ ] Buttons are accessible
- [ ] Keyboard doesn't obscure important content

---

### Test Scenario 7.31: Filter Edge Cases - No Results

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: User applies very restrictive filters

**When**: Filters result in 0 products

**Then**:
- [ ] Product grid shows empty state
- [ ] Message: "Nu am găsit produse cu aceste criterii" or similar
- [ ] Result count shows "0 produse găsite"
- [ ] Filters remain visible and active
- [ ] User can adjust or clear filters

**When**: User views filter badges

**Then**:
- [ ] Some filter options may show count (0)
- [ ] User can see which additional filters have no products

---

### Test Scenario 7.32: Advanced Search Modal - Multiple Opens/Closes

**Priority**: Low
**Estimated Time**: 2 minutes

**Given**: User is on catalog page

**When**: User opens advanced search modal, selects filters, then closes without applying

**Then**:
- [ ] Modal closes
- [ ] Filters are not applied to catalog
- [ ] Previous filter state is maintained

**When**: User opens modal again

**Then**:
- [ ] Modal shows current active filters from catalog
- [ ] If user previously selected but didn't apply, those selections are lost
- [ ] Modal always syncs with current catalog filter state

---

### Test Scenario 7.33: Filter Performance - Large Product Sets

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: Catalog has 500+ products

**When**: User applies a filter

**Then**:
- [ ] Filter updates happen within 500ms
- [ ] Product grid updates smoothly without lag
- [ ] No browser freezing or unresponsiveness
- [ ] Filter badges update quickly

**When**: User rapidly toggles multiple filters

**Then**:
- [ ] UI remains responsive
- [ ] Final filter state is correct
- [ ] No race conditions or incorrect states

---

### Test Scenario 7.34: Cross-Browser Testing - Filters

**Priority**: Medium
**Estimated Time**: 10 minutes

**Given**: User has filters applied

**When**: User tests in Chrome

**Then**:
- [ ] All filters work correctly
- [ ] Range sliders are smooth
- [ ] Checkboxes respond properly
- [ ] Modal displays correctly

**When**: User tests in Firefox

**Then**:
- [ ] All functionality matches Chrome
- [ ] No visual glitches
- [ ] URL encoding works correctly

**When**: User tests in Safari

**Then**:
- [ ] All functionality works
- [ ] Touch interactions work on iPad
- [ ] localStorage persistence works

**Repeat**: Test in Edge if applicable

---

## Phase 7 Summary - Quick Checklist

### Phase 7: Search Optimization & Advanced Filtering (34 scenarios)

| Test Scenario | Result | Notes |
|--------------|--------|-------|
| 7.1 - Faceted Filters Display | ⬜ Pass ⬜ Fail | |
| 7.2 - Multi-Select Checkboxes | ⬜ Pass ⬜ Fail | |
| 7.3 - Grade Filter Scroll | ⬜ Pass ⬜ Fail | |
| 7.4 - Price Range Slider | ⬜ Pass ⬜ Fail | |
| 7.5 - Dimension Range Sliders | ⬜ Pass ⬜ Fail | |
| 7.6 - Clear All Functionality | ⬜ Pass ⬜ Fail | |
| 7.7 - Filter Chips Display/Removal | ⬜ Pass ⬜ Fail | |
| 7.8 - Advanced Search Modal Open/Close | ⬜ Pass ⬜ Fail | |
| 7.9 - Search Text Input | ⬜ Pass ⬜ Fail | |
| 7.10 - Category Selection | ⬜ Pass ⬜ Fail | |
| 7.11 - Grade and Standard Selection | ⬜ Pass ⬜ Fail | |
| 7.12 - Availability Filter | ⬜ Pass ⬜ Fail | |
| 7.13 - Current Filter Summary | ⬜ Pass ⬜ Fail | |
| 7.14 - Apply Search | ⬜ Pass ⬜ Fail | |
| 7.15 - Clear Filters in Modal | ⬜ Pass ⬜ Fail | |
| 7.16 - Save New Search (Authenticated) | ⬜ Pass ⬜ Fail | |
| 7.17 - Load Saved Search | ⬜ Pass ⬜ Fail | |
| 7.18 - Delete Saved Search | ⬜ Pass ⬜ Fail | |
| 7.19 - Recent Searches | ⬜ Pass ⬜ Fail | |
| 7.20 - Guest User Saved Searches | ⬜ Pass ⬜ Fail | |
| 7.21 - URL Persistence Share | ⬜ Pass ⬜ Fail | |
| 7.22 - Filter Changes Update URL | ⬜ Pass ⬜ Fail | |
| 7.23 - Dynamic Badge Updates | ⬜ Pass ⬜ Fail | |
| 7.24 - Collapsible Sections | ⬜ Pass ⬜ Fail | |
| 7.25 - Complex Filter Combinations | ⬜ Pass ⬜ Fail | |
| 7.26 - Pagination with Filters | ⬜ Pass ⬜ Fail | |
| 7.27 - Sort with Filters | ⬜ Pass ⬜ Fail | |
| 7.28 - Enter Key Behavior | ⬜ Pass ⬜ Fail | |
| 7.29 - Browser Refresh Persistence | ⬜ Pass ⬜ Fail | |
| 7.30 - Mobile Responsiveness | ⬜ Pass ⬜ Fail | |
| 7.31 - No Results Edge Case | ⬜ Pass ⬜ Fail | |
| 7.32 - Multiple Modal Opens | ⬜ Pass ⬜ Fail | |
| 7.33 - Performance Large Sets | ⬜ Pass ⬜ Fail | |
| 7.34 - Cross-Browser Testing | ⬜ Pass ⬜ Fail | |

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

# Phase 8: Analytics, SEO & Performance Optimization

**Phase Status**: ✅ Implementation Complete
**Test Status**: ⏳ Awaiting Testing
**Total Scenarios**: 30 scenarios

## Overview
Phase 8 focuses on analytics tracking with Google Tag Manager, SEO optimization with meta tags and structured data, and performance improvements including lazy loading, virtual scrolling, and build optimizations.

---

## Section 8.1: Google Tag Manager (GTM) Integration

### Test Scenario 8.1: GTM Script Loading

**Priority**: Critical
**Estimated Time**: 2 minutes

**Pre-requisites**:
- `.env` file configured with `VITE_GTM_ID=GTM-PDWD2W39`
- Dev server restarted after adding `.env`

**When**: User opens the application

**Then**:
- [ ] Open browser DevTools (F12) → Console
- [ ] Type `window.dataLayer` and press Enter
- [ ] dataLayer array exists and contains events
- [ ] No GTM-related errors in console

**When**: User checks Network tab

**Then**:
- [ ] Request to `googletagmanager.com` is present
- [ ] GTM container script loaded successfully (200 status)
- [ ] GTM ID `GTM-PDWD2W39` is visible in request

---

### Test Scenario 8.2: GTM Preview Mode Connection

**Priority**: Critical
**Estimated Time**: 3 minutes

**Pre-requisites**:
- GTM account access
- Application running at http://localhost:8080

**When**: User opens GTM Preview Mode
1. Go to https://tagmanager.google.com/
2. Select container GTM-PDWD2W39
3. Click "Preview" button
4. Enter URL: `http://localhost:8080`
5. Click "Connect"

**Then**:
- [ ] Debug window opens successfully
- [ ] Connection to local app established
- [ ] "Tag Assistant Connected" message appears
- [ ] Events appear in debug timeline

---

### Test Scenario 8.3: Page View Event Tracking

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: GTM Preview Mode is active

**When**: User navigates to different pages
- Homepage (/)
- Catalog (/catalog)
- Product Detail (/product/hea-200-s235jr)
- Cart (/cart)
- RFQ Form (/rfq)

**Then**: For each page navigation
- [ ] `page_view` event fires in GTM Preview
- [ ] Event contains `page_path` parameter
- [ ] Event contains `page_title` parameter
- [ ] Event fires immediately on page load
- [ ] No duplicate `page_view` events

---

## Section 8.2: Analytics Event Tracking

### Test Scenario 8.4: Catalog View Tracking

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: GTM Preview Mode is active

**When**: User visits catalog page at `/catalog`

**Then**:
- [ ] `catalog_view` event fires
- [ ] Event contains `category` parameter (if filtered)
- [ ] Event fires once per page visit
- [ ] In dataLayer: `window.dataLayer` shows event with correct data

**When**: User filters by family (e.g., "profiles")

**Then**:
- [ ] New `catalog_view` event fires
- [ ] `category` parameter shows selected family
- [ ] Event data is accurate

---

### Test Scenario 8.5: Filter Apply Tracking

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User is on catalog page with GTM Preview active

**When**: User applies filters:
1. Select family: "profiles"
2. Select grade: "S235JR"
3. Select standard: "EN 10025"
4. Adjust price range slider
5. Click "Apply" or filters auto-apply

**Then**:
- [ ] `filter_apply` event fires
- [ ] Event contains `family` parameter
- [ ] Event contains `grade` parameter
- [ ] Event contains `standard` parameter
- [ ] Event contains `priceRange` with min/max values
- [ ] All filter data is accurate in dataLayer

---

### Test Scenario 8.6: Product Detail Page (PDP) View Tracking

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: GTM Preview Mode is active

**When**: User clicks on a product from catalog

**Then**:
- [ ] `pdp_view` event fires
- [ ] Event contains product data:
  - [ ] `product_id`
  - [ ] `product_sku`
  - [ ] `product_title`
  - [ ] `product_family`
  - [ ] `product_grade`
  - [ ] `base_price`
- [ ] Event fires once per product view
- [ ] Data matches the actual product

---

### Test Scenario 8.7: Add to Estimate Tracking

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User is on Product Detail Page with GTM Preview active

**When**: User configures product and clicks "Adaugă la Estimare":
1. Select quantity: 10
2. Select unit: kg
3. Select finish: Zincat
4. Click "Adaugă la Estimare"

**Then**:
- [ ] `add_to_estimate` event fires
- [ ] Event contains:
  - [ ] `product_id`
  - [ ] `product_sku`
  - [ ] `product_title`
  - [ ] `quantity` (10)
  - [ ] `unit` (kg)
  - [ ] `total_price`
- [ ] Toast notification appears
- [ ] Cart drawer opens
- [ ] Event fires only once per add action

---

### Test Scenario 8.8: Cart Update Tracking

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: Cart has items and GTM Preview is active

**When**: User updates cart:
1. Add new item to cart
2. Update quantity of existing item
3. Remove an item from cart
4. Clear entire cart

**Then**: For each action
- [ ] `estimate_update` event fires
- [ ] Event contains:
  - [ ] `item_count` (current number of cart items)
  - [ ] `total_weight` (in kg)
  - [ ] `total_price` (subtotal)
- [ ] Values are accurate after each change
- [ ] Event fires after state update completes

---

### Test Scenario 8.9: Search Tracking

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: GTM Preview Mode is active

**When**: User performs search:
1. Click search bar in header
2. Type "HEA 200"
3. Press Enter or select result

**Then**:
- [ ] `search` event fires
- [ ] Event contains:
  - [ ] `search_query` ("HEA 200")
  - [ ] `result_count` (number of results found)
- [ ] Event fires when search is submitted
- [ ] Search results are displayed
- [ ] Navigation to catalog with search query works

---

### Test Scenario 8.10: BOM Upload Tracking

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User is on BOM Upload page with GTM Preview active

**When**: User uploads BOM file:
1. Navigate to `/bom-upload`
2. Upload a valid BOM CSV file
3. File processes successfully

**Then**:
- [ ] `bom_upload` event fires after processing
- [ ] Event contains:
  - [ ] `file_name`
  - [ ] `total_rows`
  - [ ] `matched_rows` (auto-matched products)
  - [ ] `unmatched_rows` (require manual mapping)
  - [ ] `parse_errors` (count)
- [ ] Event data matches BOM results
- [ ] Event fires once per upload

---

### Test Scenario 8.11: RFQ Flow Tracking

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: Cart has items and GTM Preview is active

**When**: User starts RFQ flow:
1. Click "Cere Ofertă" button
2. Navigate to RFQ form

**Then**:
- [ ] `rfq_start` event fires
- [ ] Event contains `source` parameter ("rfq_form")

**When**: User completes each step:
- Step 1: Company Info
- Step 2: Delivery Address
- Step 3: Preferences
- Step 4: Attachments
- Step 5: Review

**Then**: For each step completion
- [ ] `rfq_step` event fires
- [ ] Event contains:
  - [ ] `step_number` (1-5)
  - [ ] `step_name` (e.g., "company_info")
- [ ] Event fires after clicking "Next" on each step

**When**: User submits RFQ on final step

**Then**:
- [ ] `rfq_submit` event fires
- [ ] Event contains:
  - [ ] `reference_number`
  - [ ] `item_count`
  - [ ] `total_value`
  - [ ] `company`
  - [ ] `incoterm`
- [ ] User redirected to confirmation page
- [ ] Event data is complete and accurate

---

### Test Scenario 8.12: Login Tracking

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: GTM Preview Mode is active

**When**: User logs in:
1. Navigate to `/login`
2. Enter credentials
3. Click "Autentifică-te"
4. Login succeeds

**Then**:
- [ ] `login` event fires
- [ ] Event contains `account_type` ("business")
- [ ] User redirected to account page
- [ ] Success toast appears
- [ ] Event fires once per login

---

### Test Scenario 8.13: Signup Tracking

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: GTM Preview Mode is active

**When**: User creates account:
1. Navigate to `/signup`
2. Select account type: "Business" or "Individual"
3. Fill in required fields
4. Submit form
5. Signup succeeds

**Then**:
- [ ] `signup` event fires
- [ ] Event contains `account_type` (matches selection)
- [ ] User redirected to account page
- [ ] Success toast appears
- [ ] Event fires once per signup

---

### Test Scenario 8.14: Contact Click Tracking

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: GTM Preview Mode is active

**When**: User clicks phone number in header:
- Click phone number: "+40 xxx xxx xxx"

**Then**:
- [ ] `contact_click` event fires
- [ ] Event contains `contact_type` ("phone")
- [ ] Phone dialer opens (mobile) or tel: link activates

**When**: User clicks email in footer:
- Click email: "vanzari@metalpro.ro"

**Then**:
- [ ] `contact_click` event fires
- [ ] Event contains `contact_type` ("email")
- [ ] Email client opens with pre-filled address

---

## Section 8.3: SEO Optimization

### Test Scenario 8.15: Meta Tags - Homepage

**Priority**: High
**Estimated Time**: 2 minutes

**When**: User visits homepage (/)

**Then**: View page source (right-click → View Page Source)
- [ ] `<title>` tag exists and contains "MetalPro"
- [ ] `<meta name="description">` exists with relevant description
- [ ] `<meta name="keywords">` exists with relevant keywords
- [ ] Open Graph tags present:
  - [ ] `<meta property="og:title">`
  - [ ] `<meta property="og:description">`
  - [ ] `<meta property="og:type">` = "website"
  - [ ] `<meta property="og:url">`
- [ ] Twitter Card tags present:
  - [ ] `<meta name="twitter:card">`
  - [ ] `<meta name="twitter:title">`
  - [ ] `<meta name="twitter:description">`

---

### Test Scenario 8.16: Meta Tags - Product Detail Page

**Priority**: High
**Estimated Time**: 3 minutes

**When**: User visits product page (e.g., /product/hea-200-s235jr)

**Then**: View page source
- [ ] `<title>` contains product name and grade
- [ ] `<meta name="description">` contains product details
- [ ] `<meta property="og:type">` = "product"
- [ ] Product-specific OG tags present:
  - [ ] `<meta property="product:price:amount">`
  - [ ] `<meta property="product:price:currency">` = "RON"
  - [ ] `<meta property="product:availability">`
- [ ] Canonical URL points to correct product page
- [ ] No duplicate meta tags

---

### Test Scenario 8.17: Schema.org Structured Data - Product

**Priority**: High
**Estimated Time**: 3 minutes

**When**: User visits product page

**Then**: Test with Google Rich Results Test
1. Open https://search.google.com/test/rich-results
2. Enter product page URL or paste HTML
3. Run test

**Expected Results**:
- [ ] Product schema detected
- [ ] Schema type: "Product"
- [ ] Required properties present:
  - [ ] `name`
  - [ ] `sku`
  - [ ] `description`
  - [ ] `offers` (with price and availability)
- [ ] No schema errors
- [ ] Rich results preview shows product info

---

### Test Scenario 8.18: Schema.org Breadcrumb Markup

**Priority**: Medium
**Estimated Time**: 2 minutes

**When**: User visits any page with breadcrumbs (catalog or product page)

**Then**: View page source and check for JSON-LD script
- [ ] `<script type="application/ld+json">` exists
- [ ] Contains `@type: "BreadcrumbList"`
- [ ] Contains `itemListElement` array
- [ ] Each breadcrumb has:
  - [ ] `@type: "ListItem"`
  - [ ] `position` (number)
  - [ ] `name` (text)
  - [ ] `item` (URL)
- [ ] Breadcrumb path matches visual breadcrumbs

---

### Test Scenario 8.19: Robots.txt and Sitemap

**Priority**: Medium
**Estimated Time**: 2 minutes

**When**: User accesses `/robots.txt`

**Then**:
- [ ] File loads successfully
- [ ] Contains `User-agent: *`
- [ ] Contains `Allow: /`
- [ ] Contains `Disallow: /account`
- [ ] Contains `Sitemap:` directive pointing to sitemap.xml
- [ ] Syntax is valid

**When**: User accesses `/sitemap.xml`

**Then**:
- [ ] XML file loads successfully
- [ ] Contains `<urlset>` root element
- [ ] Contains `<url>` entries for main pages
- [ ] Each URL has `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`
- [ ] XML syntax is valid

---

## Section 8.4: Performance Optimization

### Test Scenario 8.20: Lazy Loading Images

**Priority**: High
**Estimated Time**: 3 minutes

**Pre-requisites**:
- Open DevTools → Network tab
- Throttle network to "Slow 3G"

**When**: User loads catalog page with many products

**Then**:
- [ ] Initial page load is fast
- [ ] Placeholder/skeleton shown for images
- [ ] Images load as user scrolls down
- [ ] Images above fold load immediately
- [ ] Images below fold load on scroll (lazy)

**Verify**:
- [ ] Check Network tab: images request only when scrolled into view
- [ ] No layout shift when images load
- [ ] Fallback image shows if image fails to load

---

### Test Scenario 8.21: Skeleton Loaders - Catalog

**Priority**: Medium
**Estimated Time**: 2 minutes

**Pre-requisites**: Throttle network to "Slow 3G"

**When**: User navigates to catalog page

**Then**: During loading
- [ ] Product grid skeleton appears
- [ ] Skeleton matches final product card layout
- [ ] Skeleton shows correct number of cards (12)
- [ ] Animation is smooth (pulsing effect)

**When**: Products load

**Then**:
- [ ] Smooth transition from skeleton to actual content
- [ ] No layout shift
- [ ] All product cards appear correctly

---

### Test Scenario 8.22: Skeleton Loaders - Product Detail Page

**Priority**: Medium
**Estimated Time**: 2 minutes

**Pre-requisites**: Throttle network to "Slow 3G"

**When**: User clicks on a product

**Then**: During loading
- [ ] Product detail skeleton appears
- [ ] Shows skeleton for image area
- [ ] Shows skeleton for product info
- [ ] Shows skeleton for specs table
- [ ] Shows skeleton for configuration panel

**When**: Product loads

**Then**:
- [ ] Content replaces skeleton smoothly
- [ ] All sections appear correctly
- [ ] No visual glitches

---

### Test Scenario 8.23: Virtual Scrolling Performance

**Priority**: High
**Estimated Time**: 4 minutes

**Note**: Virtual scrolling will be implemented if needed for large lists (1000+ items)

**Given**: Catalog or search results with 1000+ products

**When**: User scrolls through product grid

**Then**:
- [ ] Scrolling is smooth without lag
- [ ] Only visible items are rendered in DOM
- [ ] Items render/unrender as user scrolls
- [ ] No memory leaks (check Performance monitor)
- [ ] Scroll position maintained when filtering

**Verify in DevTools**:
- [ ] Open Elements panel
- [ ] Check number of rendered product cards
- [ ] Should be ~20-30 cards maximum (not 1000)
- [ ] DOM nodes increase/decrease as you scroll

---

### Test Scenario 8.24: Build Size Optimization

**Priority**: Medium
**Estimated Time**: 5 minutes

**Pre-requisites**: Production build created

**When**: Developer runs production build:
```bash
npm run build
```

**Then**: Check `dist/` folder
- [ ] Build completes without errors
- [ ] Chunk sizes are reasonable:
  - [ ] Main chunk < 500KB
  - [ ] Vendor chunks split appropriately
  - [ ] React vendor chunk separated
  - [ ] UI vendor chunk separated
  - [ ] Form vendor chunk separated
- [ ] Source maps generated (if enabled)
- [ ] Assets folder contains optimized files

**Verify**: Check build output logs
- [ ] No chunk size warnings
- [ ] Tree shaking applied
- [ ] Code minification applied
- [ ] Console logs removed in production

---

### Test Scenario 8.25: Code Splitting Verification

**Priority**: Medium
**Estimated Time**: 3 minutes

**When**: User loads application in production mode

**Then**: Check Network tab → JS filter
- [ ] Multiple JavaScript chunk files loaded
- [ ] `react-vendor.[hash].js` exists
- [ ] `ui-vendor.[hash].js` exists
- [ ] `form-vendor.[hash].js` exists
- [ ] Route-based chunks loaded on demand
- [ ] Initial bundle size is optimized

**When**: User navigates to different routes

**Then**:
- [ ] New chunks loaded only when needed
- [ ] No duplicate code across chunks
- [ ] Chunks cached by browser

---

## Section 8.5: Error Tracking

### Test Scenario 8.26: Error Event Tracking

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: GTM Preview Mode is active

**When**: JavaScript error occurs (simulate with DevTools):
```javascript
throw new Error("Test error");
```

**Then**:
- [ ] `error` event fires in GTM
- [ ] Event contains:
  - [ ] `error_message`
  - [ ] `error_stack`
  - [ ] `page_path`
- [ ] Error is logged to dataLayer
- [ ] Application continues to function

---

## Section 8.6: Cross-Browser Testing

### Test Scenario 8.27: Analytics Cross-Browser - Chrome

**Priority**: High
**Estimated Time**: 5 minutes

**When**: User tests analytics in Chrome

**Then**: All analytics events work:
- [ ] GTM script loads
- [ ] dataLayer is accessible
- [ ] All 14 event types fire correctly
- [ ] GTM Preview Mode works
- [ ] No console errors

---

### Test Scenario 8.28: Analytics Cross-Browser - Firefox

**Priority**: High
**Estimated Time**: 5 minutes

**When**: User tests analytics in Firefox

**Then**:
- [ ] GTM script loads correctly
- [ ] dataLayer works same as Chrome
- [ ] All events fire without issues
- [ ] GTM Preview Mode works
- [ ] Performance is comparable to Chrome

---

### Test Scenario 8.29: Analytics Cross-Browser - Safari

**Priority**: Medium
**Estimated Time**: 5 minutes

**When**: User tests analytics in Safari (macOS/iOS)

**Then**:
- [ ] GTM script loads despite ITP restrictions
- [ ] dataLayer functions correctly
- [ ] Events track as expected
- [ ] No tracking prevention issues
- [ ] Touch events work on iOS

---

### Test Scenario 8.30: SEO Validation Tools

**Priority**: High
**Estimated Time**: 10 minutes

**When**: Developer tests with SEO tools:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - [ ] Product schema valid
   - [ ] Breadcrumb schema valid
   - [ ] No errors reported

2. **Google Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
   - [ ] Page is mobile-friendly
   - [ ] No usability issues

3. **Meta Tags Checker**: https://metatags.io/
   - [ ] All meta tags display correctly
   - [ ] Open Graph preview looks good
   - [ ] Twitter Card preview looks good

4. **PageSpeed Insights**: https://pagespeed.web.dev/
   - [ ] Performance score ≥ 85
   - [ ] SEO score ≥ 90
   - [ ] Accessibility score ≥ 85

---

## Phase 8 Summary - Quick Checklist

### Phase 8: Analytics, SEO & Performance Optimization (30 scenarios)

| Test Scenario | Result | Notes |
|--------------|--------|-------|
| 8.1 - GTM Script Loading | ⬜ Pass ⬜ Fail | |
| 8.2 - GTM Preview Mode | ⬜ Pass ⬜ Fail | |
| 8.3 - Page View Tracking | ⬜ Pass ⬜ Fail | |
| 8.4 - Catalog View Tracking | ⬜ Pass ⬜ Fail | |
| 8.5 - Filter Apply Tracking | ⬜ Pass ⬜ Fail | |
| 8.6 - PDP View Tracking | ⬜ Pass ⬜ Fail | |
| 8.7 - Add to Estimate Tracking | ⬜ Pass ⬜ Fail | |
| 8.8 - Cart Update Tracking | ⬜ Pass ⬜ Fail | |
| 8.9 - Search Tracking | ⬜ Pass ⬜ Fail | |
| 8.10 - BOM Upload Tracking | ⬜ Pass ⬜ Fail | |
| 8.11 - RFQ Flow Tracking | ⬜ Pass ⬜ Fail | |
| 8.12 - Login Tracking | ⬜ Pass ⬜ Fail | |
| 8.13 - Signup Tracking | ⬜ Pass ⬜ Fail | |
| 8.14 - Contact Click Tracking | ⬜ Pass ⬜ Fail | |
| 8.15 - Meta Tags Homepage | ⬜ Pass ⬜ Fail | |
| 8.16 - Meta Tags Product Page | ⬜ Pass ⬜ Fail | |
| 8.17 - Schema.org Product | ⬜ Pass ⬜ Fail | |
| 8.18 - Schema.org Breadcrumb | ⬜ Pass ⬜ Fail | |
| 8.19 - Robots.txt & Sitemap | ⬜ Pass ⬜ Fail | |
| 8.20 - Lazy Loading Images | ⬜ Pass ⬜ Fail | |
| 8.21 - Skeleton Loaders Catalog | ⬜ Pass ⬜ Fail | |
| 8.22 - Skeleton Loaders PDP | ⬜ Pass ⬜ Fail | |
| 8.23 - Virtual Scrolling Performance | ⬜ Pass ⬜ Fail | |
| 8.24 - Build Size Optimization | ⬜ Pass ⬜ Fail | |
| 8.25 - Code Splitting | ⬜ Pass ⬜ Fail | |
| 8.26 - Error Event Tracking | ⬜ Pass ⬜ Fail | |
| 8.27 - Cross-Browser Chrome | ⬜ Pass ⬜ Fail | |
| 8.28 - Cross-Browser Firefox | ⬜ Pass ⬜ Fail | |
| 8.29 - Cross-Browser Safari | ⬜ Pass ⬜ Fail | |
| 8.30 - SEO Validation Tools | ⬜ Pass ⬜ Fail | |

### Phase 8 Key Metrics

**Analytics**:
- [ ] All 14 event types tracking correctly
- [ ] GTM dataLayer populated with accurate data
- [ ] No tracking errors in console
- [ ] Events fire at correct times

**SEO**:
- [ ] Meta tags complete and accurate
- [ ] Schema.org markup valid
- [ ] Robots.txt and sitemap.xml accessible
- [ ] Rich results preview working

**Performance**:
- [ ] Images lazy load correctly
- [ ] Skeleton loaders smooth
- [ ] Build size optimized
- [ ] Page load time < 3s

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

## Phase 9: Internationalization (i18n) & Localization

### Test Scenario 9.1: Language Switcher - Display and Functionality

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User is on any page of the application

**When**: User looks at the header navigation

**Then**:
- [ ] Language switcher is visible in the header (top right area)
- [ ] Current language is displayed with flag icon (🇷🇴 for Romanian, 🇬🇧 for English)
- [ ] Clicking the language switcher opens a dropdown/menu
- [ ] Both Romanian and English options are shown
- [ ] Each language option shows the flag icon and language name

**When**: User clicks to switch from Romanian to English

**Then**:
- [ ] UI immediately updates to English
- [ ] Flag icon changes to 🇬🇧
- [ ] Selected language is stored in localStorage (key: `metalpro_language`)
- [ ] Page does not reload (SPA behavior maintained)
- [ ] All visible text updates to English

---

### Test Scenario 9.2: Language Persistence Across Sessions

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: User has previously selected English language

**When**: User refreshes the page (Ctrl+R or F5)

**Then**:
- [ ] Page loads in English (selected language persists)
- [ ] Flag icon shows 🇬🇧
- [ ] All content is in English

**When**: User opens a new tab and navigates to the application

**Then**:
- [ ] New tab loads in English (same as previous selection)
- [ ] Language preference is maintained across tabs

**When**: User closes browser and reopens application

**Then**:
- [ ] Application loads in English (localStorage persists)

---

### Test Scenario 9.3: Homepage Translation - Complete Coverage

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: User is on the homepage (/)

**When**: Language is set to Romanian

**Then verify all Romanian text**:
- [ ] Hero section title: "Materiale Metalice pentru Proiecte B2B"
- [ ] Hero subtitle is in Romanian
- [ ] Trust badges: "Estimare în timp real", "Suport specialist", "Livrare rapidă"
- [ ] CTA buttons: "Vezi Catalogul", "Încarcă Listă BOM"
- [ ] Statistics labels are in Romanian
- [ ] Category section heading: "Explorează Categoriile"
- [ ] All category cards show Romanian titles and descriptions
- [ ] Footer sections are in Romanian

**When**: User switches to English

**Then verify all English text**:
- [ ] Hero section title: "Metal Materials for B2B Projects"
- [ ] Hero subtitle is in English
- [ ] Trust badges: "Real-time estimation", "Specialist support", "Fast delivery"
- [ ] CTA buttons: "View Catalog", "Upload BOM List"
- [ ] Statistics labels are in English
- [ ] Category section heading: "Explore Categories"
- [ ] All category cards show English titles and descriptions
- [ ] Footer sections are in English

---

### Test Scenario 9.4: Catalog Page Translation - Header and Controls

**Priority**: Critical
**Estimated Time**: 4 minutes

**Given**: User is on the catalog page (/catalog)

**When**: Language is set to Romanian

**Then**:
- [ ] Page title: "Catalog Produse"
- [ ] Page description is in Romanian
- [ ] Result count: "X produse găsite" or "1 produs găsit"
- [ ] Advanced Search button: "Căutare Avansată"
- [ ] Sort dropdown label: "Sortează după:"
- [ ] Sort options:
  - [ ] "Implicit"
  - [ ] "Nume (A-Z)"
  - [ ] "Nume (Z-A)"
  - [ ] "Preț (crescător)"
  - [ ] "Preț (descrescător)"
  - [ ] "Disponibilitate"
  - [ ] "Cele mai noi"

**When**: User switches to English

**Then**:
- [ ] Page title: "Product Catalog"
- [ ] Page description is in English
- [ ] Result count: "X products found" or "1 product found"
- [ ] Advanced Search button: "Advanced Search"
- [ ] Sort dropdown label: "Sort by:"
- [ ] Sort options:
  - [ ] "Default"
  - [ ] "Name (A-Z)"
  - [ ] "Name (Z-A)"
  - [ ] "Price (Low to High)"
  - [ ] "Price (High to Low)"
  - [ ] "Availability"
  - [ ] "Newest"

---

### Test Scenario 9.5: Catalog Page Translation - Filter Labels

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: User is on the catalog page with filters visible

**When**: Language is set to Romanian

**Then verify filter section labels**:
- [ ] Main heading: "Filtrează"
- [ ] Category section: "Categorie Produse"
- [ ] Family options:
  - [ ] "Profile Metalice"
  - [ ] "Table de Oțel"
  - [ ] "Țevi și Tuburi"
  - [ ] "Elemente de Asamblare"
  - [ ] "Oțel Inoxidabil"
  - [ ] "Metale Neferoase"
- [ ] Grade section: "Grad Material"
- [ ] Standard section: "Standard"
- [ ] Availability section: "Disponibilitate"
- [ ] Availability options:
  - [ ] "În Stoc"
  - [ ] "La Comandă"
  - [ ] "Comandă Viitoare"

**When**: User switches to English

**Then verify filter section labels**:
- [ ] Main heading: "Filter"
- [ ] Category section: "Product Category"
- [ ] Family options:
  - [ ] "Metal Profiles"
  - [ ] "Steel Plates"
  - [ ] "Pipes & Tubes"
  - [ ] "Fasteners"
  - [ ] "Stainless Steel"
  - [ ] "Non-Ferrous Metals"
- [ ] Grade section: "Material Grade"
- [ ] Standard section: "Standard"
- [ ] Availability section: "Availability"
- [ ] Availability options:
  - [ ] "In Stock"
  - [ ] "On Order"
  - [ ] "Backorder"

---

### Test Scenario 9.6: Product Card Translation - All Elements

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: User is viewing product cards in the catalog

**When**: Language is set to Romanian and user views a product card

**Then**:
- [ ] Availability badge shows Romanian text:
  - [ ] "În Stoc" (green badge)
  - [ ] "La Comandă" (blue badge)
  - [ ] "Comandă Viitoare" (gray badge)
- [ ] Price section shows:
  - [ ] "De la X RON" (if minimum price)
  - [ ] "Până la X RON" (if maximum price)
  - [ ] "Cere Ofertă" (if no price)
  - [ ] "Preț indicativ / kg" or similar unit
- [ ] Delivery estimate: "Livrare în 3-5 zile"
- [ ] View details button: "Vezi Detalii"

**When**: User switches to English

**Then**:
- [ ] Availability badge shows English text:
  - [ ] "In Stock" (green badge)
  - [ ] "On Order" (blue badge)
  - [ ] "Backorder" (gray badge)
- [ ] Price section shows:
  - [ ] "from X RON" (if minimum price)
  - [ ] "up to X RON" (if maximum price)
  - [ ] "On Request" (if no price)
  - [ ] "Indicative price / kg" or similar unit
- [ ] Delivery estimate: "Delivery in 3-5 days"
- [ ] View details button: "View details"

---

### Test Scenario 9.7: Advanced Search Modal Translation

**Priority**: Critical
**Estimated Time**: 6 minutes

**Given**: User clicks "Căutare Avansată" / "Advanced Search" button

**When**: Language is set to Romanian

**Then**:
- [ ] Modal title: "Căutare Avansată"
- [ ] Modal description is in Romanian
- [ ] Search input label: "Caută în titlu, SKU, descriere"
- [ ] Search input placeholder includes Romanian example
- [ ] Section labels:
  - [ ] "Categorie Produse"
  - [ ] "Grad Material"
  - [ ] "Standard"
  - [ ] "Disponibilitate"
- [ ] Saved searches section: "Căutări Salvate"
- [ ] Recent searches section: "Căutări Recente"
- [ ] Current filters label: "Filtre Curente"
- [ ] Buttons:
  - [ ] "Șterge Tot" (Clear All)
  - [ ] "Salvează" (Save)
  - [ ] "Anulează" (Cancel)
  - [ ] "Aplică Căutarea" (Apply Search)

**When**: User switches to English

**Then**:
- [ ] Modal title: "Advanced Search"
- [ ] Modal description is in English
- [ ] Search input label: "Search in title, SKU, description"
- [ ] Search input placeholder includes English example
- [ ] Section labels:
  - [ ] "Product Category"
  - [ ] "Material Grade"
  - [ ] "Standard"
  - [ ] "Availability"
- [ ] Saved searches section: "Saved Searches"
- [ ] Recent searches section: "Recent Searches"
- [ ] Current filters label: "Current Filters"
- [ ] Buttons:
  - [ ] "Clear All"
  - [ ] "Save"
  - [ ] "Cancel"
  - [ ] "Apply Search"

---

### Test Scenario 9.8: Advanced Search Toast Messages Translation

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User is in the Advanced Search modal

**When**: User applies filters (language set to Romanian)

**Then**:
- [ ] Toast title: "Filtre aplicate"
- [ ] Toast description shows filter summary in Romanian

**When**: User tries to save search without a name (Romanian)

**Then**:
- [ ] Error toast title: "Nume lipsă"
- [ ] Error toast description is in Romanian

**When**: User successfully saves a search (Romanian)

**Then**:
- [ ] Success toast title: "Căutare salvată"
- [ ] Success toast description includes search name in Romanian

**When**: User switches to English and applies filters

**Then**:
- [ ] Toast title: "Filters applied"
- [ ] Toast description shows filter summary in English

**When**: User deletes a saved search (English)

**Then**:
- [ ] Success toast title: "Search deleted"
- [ ] Toast description in English

---

### Test Scenario 9.9: Product Detail Page (PDP) Translation

**Priority**: Critical
**Estimated Time**: 7 minutes

**Given**: User navigates to a product detail page

**When**: Language is set to Romanian

**Then verify all sections**:
- [ ] Breadcrumbs show Romanian labels
- [ ] Availability badge: "În Stoc" / "La Comandă" / "Comandă Viitoare"
- [ ] Price section: "Preț indicativ", "De la X RON"
- [ ] Tabs:
  - [ ] "Specificații"
  - [ ] "Descriere"
  - [ ] "Produse Similare"
- [ ] Specifications labels in Romanian (Dimensiuni, Grad, Standard, etc.)
- [ ] Delivery section: "Livrare în X-Y zile lucrătoare"
- [ ] Add to estimate button: "Adaugă la Estimare"
- [ ] "Cere Ofertă" button

**When**: User switches to English

**Then verify all sections**:
- [ ] Breadcrumbs show English labels
- [ ] Availability badge: "In Stock" / "On Order" / "Backorder"
- [ ] Price section: "Indicative price", "from X RON"
- [ ] Tabs:
  - [ ] "Specifications"
  - [ ] "Description"
  - [ ] "Similar Products"
- [ ] Specifications labels in English (Dimensions, Grade, Standard, etc.)
- [ ] Delivery section: "Delivery in X-Y working days"
- [ ] Add to estimate button: "Add to Estimate"
- [ ] "Request Quote" button

---

### Test Scenario 9.10: Cart/Estimate Page Translation

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: User has items in cart and navigates to /cart

**When**: Language is set to Romanian

**Then**:
- [ ] Page title: "Estimare Comandă"
- [ ] Table headers:
  - [ ] "Produs"
  - [ ] "Cantitate"
  - [ ] "Preț/unitate"
  - [ ] "Total"
- [ ] Summary section:
  - [ ] "Subtotal"
  - [ ] "TVA (19%)"
  - [ ] "Transport estimat"
  - [ ] "Total Estimat"
- [ ] Empty cart message: "Estimarea ta este goală"
- [ ] Continue shopping button: "Continuă Cumpărăturile"
- [ ] Request quote button: "Trimite Cerere Ofertă"

**When**: User switches to English

**Then**:
- [ ] Page title: "Order Estimate"
- [ ] Table headers:
  - [ ] "Product"
  - [ ] "Quantity"
  - [ ] "Price/unit"
  - [ ] "Total"
- [ ] Summary section:
  - [ ] "Subtotal"
  - [ ] "VAT (19%)"
  - [ ] "Estimated shipping"
  - [ ] "Estimated Total"
- [ ] Empty cart message: "Your estimate is empty"
- [ ] Continue shopping button: "Continue Shopping"
- [ ] Request quote button: "Request Quote"

---

### Test Scenario 9.11: RFQ Form Translation and Validation

**Priority**: Critical
**Estimated Time**: 6 minutes

**Given**: User is on the RFQ form page

**When**: Language is set to Romanian

**Then**:
- [ ] Form title: "Solicită Ofertă"
- [ ] Field labels:
  - [ ] "Nume complet"
  - [ ] "Email"
  - [ ] "Telefon"
  - [ ] "Companie"
  - [ ] "Cod fiscal (CUI)"
  - [ ] "Adresa de livrare"
  - [ ] "Mesaj adițional"
- [ ] Field placeholders are in Romanian
- [ ] Submit button: "Trimite Cerere"

**When**: User submits form with empty required fields (Romanian)

**Then**:
- [ ] Validation errors appear in Romanian:
  - [ ] "Acest câmp este obligatoriu"
  - [ ] "Email invalid"
  - [ ] "Telefon invalid"

**When**: User switches to English

**Then**:
- [ ] Form title: "Request Quote"
- [ ] Field labels:
  - [ ] "Full name"
  - [ ] "Email"
  - [ ] "Phone"
  - [ ] "Company"
  - [ ] "Tax ID (CUI)"
  - [ ] "Delivery address"
  - [ ] "Additional message"
- [ ] Field placeholders are in English
- [ ] Submit button: "Send Request"

**When**: User submits form with empty required fields (English)

**Then**:
- [ ] Validation errors appear in English:
  - [ ] "This field is required"
  - [ ] "Invalid email"
  - [ ] "Invalid phone number"

---

### Test Scenario 9.12: BOM Upload Page Translation

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User is on the BOM upload page (/bom-upload)

**When**: Language is set to Romanian

**Then**:
- [ ] Page title: "Încarcă Listă BOM"
- [ ] Instructions text is in Romanian
- [ ] Upload area text: "Trage fișierul aici sau click pentru a selecta"
- [ ] Accepted formats: "Formate acceptate: Excel, CSV"
- [ ] Template download link: "Descarcă șablon Excel"
- [ ] Parse button: "Procesează BOM"
- [ ] Results table headers are in Romanian

**When**: User switches to English

**Then**:
- [ ] Page title: "Upload BOM List"
- [ ] Instructions text is in English
- [ ] Upload area text: "Drag file here or click to select"
- [ ] Accepted formats: "Accepted formats: Excel, CSV"
- [ ] Template download link: "Download Excel template"
- [ ] Parse button: "Process BOM"
- [ ] Results table headers are in English

---

### Test Scenario 9.13: User Account Pages Translation (if implemented)

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User account features are implemented

**When**: Language is set to Romanian and user is on login page

**Then**:
- [ ] Page title: "Autentificare"
- [ ] Email label: "Email"
- [ ] Password label: "Parolă"
- [ ] Login button: "Autentifică-te"
- [ ] Forgot password link: "Ai uitat parola?"
- [ ] Create account link: "Creează cont"

**When**: User is on registration page (Romanian)

**Then**:
- [ ] Page title: "Înregistrare"
- [ ] All form labels are in Romanian
- [ ] Submit button: "Înregistrează-te"

**When**: User switches to English

**Then**:
- [ ] Login page title: "Login"
- [ ] Email label: "Email"
- [ ] Password label: "Password"
- [ ] Login button: "Sign In"
- [ ] Forgot password link: "Forgot password?"
- [ ] Create account link: "Create account"
- [ ] Registration page title: "Sign Up"
- [ ] Submit button: "Sign Up"

---

### Test Scenario 9.14: Number and Currency Formatting

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User is viewing products with prices

**When**: Language is set to Romanian

**Then**:
- [ ] Prices display with Romanian number format
- [ ] Thousand separators use dots: "1.500 RON"
- [ ] Decimal separators use commas: "1.500,50 RON"
- [ ] Currency is "RON" (Romanian Leu)

**When**: Language is set to English

**Then**:
- [ ] Prices display with English number format
- [ ] Thousand separators use commas: "1,500 RON"
- [ ] Decimal separators use dots: "1,500.50 RON"
- [ ] Currency is "RON" (consistent)

**Note**: Verify this on:
- [ ] Product cards in catalog
- [ ] Product detail page
- [ ] Cart summary
- [ ] RFQ summary

---

### Test Scenario 9.15: Date Formatting per Locale

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: Application displays dates (order history, RFQ timestamps, etc.)

**When**: Language is set to Romanian

**Then**:
- [ ] Dates display in Romanian format: "10 noiembrie 2025"
- [ ] Or DD.MM.YYYY: "10.11.2025"
- [ ] Relative dates: "azi", "ieri", "acum 2 zile"

**When**: Language is set to English

**Then**:
- [ ] Dates display in English format: "November 10, 2025"
- [ ] Or MM/DD/YYYY: "11/10/2025"
- [ ] Relative dates: "today", "yesterday", "2 days ago"

---

### Test Scenario 9.16: Units Translation (Measurement Units)

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Products have measurement units (kg, m, pcs)

**When**: Language is set to Romanian

**Then**:
- [ ] Weight unit: "kg" (kilograms)
- [ ] Length unit: "m" (metri)
- [ ] Pieces unit: "buc" (bucăți) or "pcs"
- [ ] Unit labels in forms: "Metri (m)", "Kilograme (kg)", "Bucăți (buc)"

**When**: Language is set to English

**Then**:
- [ ] Weight unit: "kg" (kilograms)
- [ ] Length unit: "m" (meters)
- [ ] Pieces unit: "pcs" (pieces)
- [ ] Unit labels in forms: "Meters (m)", "Kilograms (kg)", "Pieces (pcs)"

---

### Test Scenario 9.17: Error Pages Translation (404, 500, etc.)

**Priority**: Medium
**Estimated Time**: 4 minutes

**Given**: User encounters an error page

**When**: User navigates to non-existent page (/nonexistent) with Romanian language

**Then**:
- [ ] 404 page title: "Pagina nu a fost găsită"
- [ ] Error message is in Romanian
- [ ] "Înapoi la pagina principală" button

**When**: User switches to English

**Then**:
- [ ] 404 page title: "Page not found"
- [ ] Error message is in English
- [ ] "Back to homepage" button

**When**: Application error occurs (simulate with broken component)

**Then in Romanian**:
- [ ] Error boundary shows Romanian message
- [ ] "Reîncarcă pagina" button

**Then in English**:
- [ ] Error boundary shows English message
- [ ] "Reload page" button

---

### Test Scenario 9.18: Toast/Notification Messages Translation

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User performs actions that trigger toast notifications

**When**: User adds product to cart (Romanian)

**Then**:
- [ ] Toast title: "Adăugat în estimare"
- [ ] Toast description includes product name

**When**: User removes item from cart (Romanian)

**Then**:
- [ ] Toast title: "Eliminat din estimare"

**When**: User submits RFQ successfully (Romanian)

**Then**:
- [ ] Success toast: "Cerere trimisă cu succes"
- [ ] Description is in Romanian

**When**: User switches to English and performs same actions

**Then**:
- [ ] Add to cart toast: "Added to estimate"
- [ ] Remove from cart toast: "Removed from estimate"
- [ ] RFQ success toast: "Request submitted successfully"
- [ ] All descriptions are in English

---

### Test Scenario 9.19: Breadcrumbs Translation

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: User navigates through different pages

**When**: Language is set to Romanian

**Then on catalog page**:
- [ ] Breadcrumbs: "Acasă > Catalog"

**Then on product detail page**:
- [ ] Breadcrumbs: "Acasă > Catalog > [Category] > [Product]"
- [ ] Category names are in Romanian

**Then on cart page**:
- [ ] Breadcrumbs: "Acasă > Estimare"

**When**: User switches to English

**Then**:
- [ ] Catalog: "Home > Catalog"
- [ ] Product: "Home > Catalog > [Category] > [Product]"
- [ ] Category names are in English
- [ ] Cart: "Home > Estimate"

---

### Test Scenario 9.20: Footer Translation

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: User views the footer on any page

**When**: Language is set to Romanian

**Then**:
- [ ] Section headings are in Romanian:
  - [ ] "Despre Noi"
  - [ ] "Servicii"
  - [ ] "Contact"
- [ ] Footer links are in Romanian
- [ ] Copyright text is in Romanian
- [ ] Social media labels are in Romanian

**When**: User switches to English

**Then**:
- [ ] Section headings are in English:
  - [ ] "About Us"
  - [ ] "Services"
  - [ ] "Contact"
- [ ] Footer links are in English
- [ ] Copyright text is in English
- [ ] Social media labels are in English

---

### Test Scenario 9.21: Search Functionality Translation

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User is using the search feature

**When**: Language is set to Romanian

**Then**:
- [ ] Search input placeholder: "Caută profile, table, țevi..."
- [ ] Search button label: "Caută"
- [ ] No results message: "Nu s-au găsit rezultate pentru '[query]'"
- [ ] Search results count: "X rezultate găsite"

**When**: User switches to English

**Then**:
- [ ] Search input placeholder: "Search profiles, plates, pipes..."
- [ ] Search button label: "Search"
- [ ] No results message: "No results found for '[query]'"
- [ ] Search results count: "X results found"

---

### Test Scenario 9.22: Loading States and Skeletons Translation

**Priority**: Low
**Estimated Time**: 2 minutes

**Given**: User navigates to catalog page with slow network (throttle to Slow 3G)

**When**: Language is set to Romanian

**Then**:
- [ ] Loading text (if any): "Se încarcă..."
- [ ] Skeleton loaders display

**When**: Language is set to English

**Then**:
- [ ] Loading text (if any): "Loading..."
- [ ] Skeleton loaders display

---

### Test Scenario 9.23: Pagination Translation

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: User is on catalog page with multiple pages of results

**When**: Language is set to Romanian

**Then**:
- [ ] Pagination shows: "Pagina X din Y"
- [ ] Previous button: "Anterior"
- [ ] Next button: "Următorul"

**When**: User switches to English

**Then**:
- [ ] Pagination shows: "Page X of Y"
- [ ] Previous button: "Previous"
- [ ] Next button: "Next"

---

### Test Scenario 9.24: Language Switching During Form Fill

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User is filling out RFQ form

**When**: User fills in name and email fields (language: Romanian)

**Then**:
- [ ] Fields have Romanian labels and placeholders
- [ ] User input remains in the fields

**When**: User switches language to English mid-form

**Then**:
- [ ] Labels change to English
- [ ] Placeholders change to English
- [ ] **User input remains intact** (data not lost)
- [ ] Form validation messages will be in English on next submit

---

### Test Scenario 9.25: Browser Language Detection

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: New user visits application for first time (clear localStorage first)

**When**: Browser language is set to Romanian (ro-RO)

**Then**:
- [ ] Application loads in Romanian by default
- [ ] Language is stored in localStorage

**When**: Browser language is set to English (en-US or en-GB)

**Then**:
- [ ] Application loads in English by default
- [ ] Language is stored in localStorage

**When**: Browser language is set to unsupported language (e.g., French)

**Then**:
- [ ] Application loads in Romanian (fallback language)
- [ ] Language switcher still works

---

### Test Scenario 9.26: Filter Chips Translation

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User has applied filters on catalog page

**When**: Language is set to Romanian

**Then**:
- [ ] Filter chips show Romanian labels:
  - [ ] "Categorie: Profile Metalice"
  - [ ] "Grad: S235JR"
  - [ ] "Disponibilitate: În Stoc"
- [ ] Remove filter icon (X) works

**When**: User switches to English

**Then**:
- [ ] Filter chips update to English labels:
  - [ ] "Category: Metal Profiles"
  - [ ] "Grade: S235JR"
  - [ ] "Availability: In Stock"
- [ ] Chips remain functionally clickable

---

### Test Scenario 9.27: URL Parameters Preservation During Language Switch

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User is on catalog page with filters applied
**URL**: `/catalog?family=profiles&grade=S235JR&page=2`

**When**: User switches from Romanian to English

**Then**:
- [ ] URL parameters remain unchanged: `?family=profiles&grade=S235JR&page=2`
- [ ] Filters remain applied
- [ ] Current page (page 2) is maintained
- [ ] Only UI language changes

**When**: User is on product detail page: `/product/unp-100-6m-s235jr`

**Then**:
- [ ] URL remains the same after language switch
- [ ] Product slug is language-agnostic

---

### Test Scenario 9.28: Console Errors Check for Missing Translations

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: Developer has i18n debug mode enabled

**When**: User navigates through all major pages in Romanian:
- [ ] Homepage
- [ ] Catalog
- [ ] Product detail page
- [ ] Cart
- [ ] RFQ form
- [ ] Advanced search modal

**Then**:
- [ ] Open browser console
- [ ] No i18next warnings about missing keys
- [ ] No "translation key not found" errors

**When**: User switches to English and navigates through all pages

**Then**:
- [ ] Open browser console
- [ ] No i18next warnings about missing keys
- [ ] No "translation key not found" errors

---

### Test Scenario 9.29: RTL Language Support (Future-Proofing)

**Priority**: Low
**Estimated Time**: 2 minutes

**Given**: Application currently supports LTR languages only

**When**: Developer inspects HTML

**Then**:
- [ ] HTML tag has `dir="ltr"` attribute
- [ ] CSS does not use hard-coded left/right (uses logical properties where possible)
- [ ] Layout is ready for future RTL support (Arabic, Hebrew)

**Note**: This is a preparation check for future internationalization.

---

### Test Scenario 9.30: Translation File Integrity

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: Developer has access to translation files

**When**: Developer validates translation files

**Then**:
- [ ] `src/locales/ro.json` is valid JSON (no syntax errors)
- [ ] `src/locales/en.json` is valid JSON (no syntax errors)
- [ ] Both files have matching keys (same structure)
- [ ] No duplicate keys in either file
- [ ] All keys use consistent naming convention (snake_case or camelCase)
- [ ] Interpolation variables are consistent: `{{variable}}` format

**When**: Developer runs command: `python3 -m json.tool src/locales/en.json`

**Then**:
- [ ] Command succeeds without errors

**When**: Developer compares key counts

**Then**:
- [ ] Romanian file has same number of keys as English file
- [ ] No missing translations in either language

---

## Phase 9 Summary - Quick Checklist

### Phase 9: Internationalization (i18n) & Localization (30 scenarios)

| Test Scenario | Result | Notes |
|--------------|--------|-------|
| 9.1 - Language Switcher Display | ⬜ Pass ⬜ Fail | |
| 9.2 - Language Persistence | ⬜ Pass ⬜ Fail | |
| 9.3 - Homepage Translation | ⬜ Pass ⬜ Fail | |
| 9.4 - Catalog Header Translation | ⬜ Pass ⬜ Fail | |
| 9.5 - Filter Labels Translation | ⬜ Pass ⬜ Fail | |
| 9.6 - Product Card Translation | ⬜ Pass ⬜ Fail | |
| 9.7 - Advanced Search Modal | ⬜ Pass ⬜ Fail | |
| 9.8 - Toast Messages Translation | ⬜ Pass ⬜ Fail | |
| 9.9 - Product Detail Page | ⬜ Pass ⬜ Fail | |
| 9.10 - Cart/Estimate Page | ⬜ Pass ⬜ Fail | |
| 9.11 - RFQ Form Translation | ⬜ Pass ⬜ Fail | |
| 9.12 - BOM Upload Page | ⬜ Pass ⬜ Fail | |
| 9.13 - User Account Pages | ⬜ Pass ⬜ Fail | |
| 9.14 - Number/Currency Formatting | ⬜ Pass ⬜ Fail | |
| 9.15 - Date Formatting | ⬜ Pass ⬜ Fail | |
| 9.16 - Units Translation | ⬜ Pass ⬜ Fail | |
| 9.17 - Error Pages Translation | ⬜ Pass ⬜ Fail | |
| 9.18 - Toast Notifications | ⬜ Pass ⬜ Fail | |
| 9.19 - Breadcrumbs Translation | ⬜ Pass ⬜ Fail | |
| 9.20 - Footer Translation | ⬜ Pass ⬜ Fail | |
| 9.21 - Search Functionality | ⬜ Pass ⬜ Fail | |
| 9.22 - Loading States | ⬜ Pass ⬜ Fail | |
| 9.23 - Pagination Translation | ⬜ Pass ⬜ Fail | |
| 9.24 - Language Switch During Form | ⬜ Pass ⬜ Fail | |
| 9.25 - Browser Language Detection | ⬜ Pass ⬜ Fail | |
| 9.26 - Filter Chips Translation | ⬜ Pass ⬜ Fail | |
| 9.27 - URL Parameters Preservation | ⬜ Pass ⬜ Fail | |
| 9.28 - Console Errors Check | ⬜ Pass ⬜ Fail | |
| 9.29 - RTL Support Preparation | ⬜ Pass ⬜ Fail | |
| 9.30 - Translation File Integrity | ⬜ Pass ⬜ Fail | |

### Phase 9 Key Metrics

**Translation Completeness**:
- [ ] All UI strings extracted to locale files
- [ ] Both Romanian and English translations complete
- [ ] No missing translation keys in console
- [ ] No hardcoded text remaining in components

**Language Switcher**:
- [ ] Language switcher visible and functional
- [ ] Selected language persists across sessions
- [ ] Language changes apply immediately (no reload)
- [ ] All pages update when language changes

**Formatting**:
- [ ] Numbers formatted correctly per locale
- [ ] Currency displays with correct separators
- [ ] Dates formatted according to locale
- [ ] Units translated appropriately

**User Experience**:
- [ ] Language switch does not lose form data
- [ ] URL parameters preserved during switch
- [ ] No flicker or layout shift on language change
- [ ] Browser language detection works

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

**Last Updated**: 2025-11-15

**Version**: 1.7.0
**Phase Coverage**:
- Phase 1 (Infrastructure)
- Phase 2 (Catalog)
- Phase 3 (Product Detail Page)
- Phase 4 (Cart & RFQ)
- Phase 5 (BOM Upload)
- Phase 6 (Optional User Accounts & B2B Benefits)
- Phase 6C (Backend Infrastructure - Production Readiness)
- Phase 7 (Search Optimization & Advanced Filtering)
- Phase 8 (Analytics, SEO & Performance Optimization)
- Phase 9 (Internationalization & Localization)

**Total Test Scenarios**: 243 scenarios

---

## Phase 6C: Backend Infrastructure - Production Readiness

**Test Environment**: http://localhost:3001/
**Prerequisites**:
- Docker running with PostgreSQL and Redis containers
- Backend server running (`npm run dev` in backend directory)
- Prisma migrations applied
- Database seeded with initial data

### Phase 6C.1: Backend API Setup

#### Test Scenario 6C.1.1: Infrastructure Health Check

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: Docker containers are running and backend server is started

**When**: User makes a GET request to http://localhost:3001/health

**Then**:
- [ ] Response status code is 200
- [ ] Response contains `"status": "healthy"`
- [ ] Response contains `"service": "MetalPro Backend API"`
- [ ] Response contains `"database": "connected"`
- [ ] Response contains `"redis": "connected"`
- [ ] Response includes timestamp in ISO format

**Test Command**:
```bash
curl http://localhost:3001/health
```

---

#### Test Scenario 6C.1.2: Database Connection Verification

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: PostgreSQL container is running

**When**: User checks database connectivity

**Then**:
- [ ] Can connect to database at `localhost:5432`
- [ ] Database `metalpro` exists
- [ ] All 10 Prisma models are created as tables:
  - users
  - companies
  - sessions
  - categories
  - products
  - carts
  - cart_items
  - rfqs
  - rfq_items
  - projects
  - addresses
  - attachments

**Test Commands**:
```bash
# Check Docker containers
docker ps

# Connect to PostgreSQL
docker exec -it steel-craft-flow-postgres-1 psql -U metalpro_user -d metalpro

# List tables in psql
\dt
```

---

#### Test Scenario 6C.1.3: Redis Cache Connection

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Redis container is running

**When**: User checks Redis connectivity

**Then**:
- [ ] Redis responds to PING command
- [ ] Redis is accessible at `localhost:6379`
- [ ] Backend server successfully connects to Redis

**Test Commands**:
```bash
# Test Redis connection
docker exec -it steel-craft-flow-redis-1 redis-cli ping

# Should return: PONG
```

---

#### Test Scenario 6C.1.4: Database Seeding Verification

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Database migrations are applied and seed script has run

**When**: User queries the database

**Then**:
- [ ] 6 categories exist in categories table
- [ ] Categories include:
  - Profile Metalice (HEA, IPE, UNP, etc.)
  - Table de Oțel
  - Țevi și Tuburi
  - Elemente de Asamblare
  - Oțel Inoxidabil
  - Metale Neferoase
- [ ] At least 5 sample products exist in products table
- [ ] Sample products include HEA profiles, steel plates, pipes
- [ ] All products have proper metadata JSON structure

**Test Command**:
```bash
# Via API
curl http://localhost:3001/api/categories
curl http://localhost:3001/api/products
```

---

### Phase 6C.2: Route Scaffolding

#### Test Scenario 6C.2.1: Products API - List All Products

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Backend server is running and database is seeded

**When**: User makes GET request to `/api/products`

**Then**:
- [ ] Response status code is 200
- [ ] Response contains `"success": true`
- [ ] Response contains `"count"` field with number of products
- [ ] Response contains `"data"` array of products
- [ ] Each product includes:
  - id, name, sku, category
  - pricePerUnit, unit, minQuantity
  - specifications, metadata
  - isActive, createdAt, updatedAt

**Test Command**:
```bash
curl http://localhost:3001/api/products
```

**Expected Response Structure**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "category": {
        "id": "uuid",
        "name": "Category Name"
      },
      ...
    }
  ]
}
```

---

#### Test Scenario 6C.2.2: Products API - Get Single Product

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running and products exist

**When**: User makes GET request to `/api/products/{id}` with valid product ID

**Then**:
- [ ] Response status code is 200
- [ ] Response contains `"success": true`
- [ ] Response contains `"data"` object with product details
- [ ] Product includes category relationship
- [ ] All product fields are properly populated

**When**: User makes GET request with invalid/non-existent product ID

**Then**:
- [ ] Response status code is 404
- [ ] Response contains `"success": false`
- [ ] Response contains error message

**Test Commands**:
```bash
# Get valid product (replace {id} with actual product ID)
curl http://localhost:3001/api/products/{id}

# Get non-existent product
curl http://localhost:3001/api/products/00000000-0000-0000-0000-000000000000
```

---

#### Test Scenario 6C.2.3: Categories API - List All Categories

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running and database is seeded

**When**: User makes GET request to `/api/categories`

**Then**:
- [ ] Response status code is 200
- [ ] Response contains `"success": true`
- [ ] Response contains `"count"` field
- [ ] Response contains `"data"` array of categories
- [ ] Each category includes:
  - id, name, slug, description
  - sortOrder
  - _count.products (product count)
- [ ] Categories are sorted by sortOrder ascending

**Test Command**:
```bash
curl http://localhost:3001/api/categories
```

---

#### Test Scenario 6C.2.4: Categories API - Get Single Category

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: Backend server is running and categories exist

**When**: User makes GET request to `/api/categories/{id}` with valid category ID

**Then**:
- [ ] Response status code is 200
- [ ] Response contains category details
- [ ] Response includes product count

**When**: User makes GET request with invalid category ID

**Then**:
- [ ] Response status code is 404
- [ ] Response contains error message

**Test Commands**:
```bash
# Get valid category
curl http://localhost:3001/api/categories/{id}

# Get non-existent category
curl http://localhost:3001/api/categories/00000000-0000-0000-0000-000000000000
```

---

#### Test Scenario 6C.2.5: API Base Info Endpoint

**Priority**: Low
**Estimated Time**: 1 minute

**Given**: Backend server is running

**When**: User makes GET request to `/api`

**Then**:
- [ ] Response status code is 200
- [ ] Response contains:
  - name: "MetalPro Backend API"
  - version: "1.0.0"
  - description
  - endpoints (list of available API endpoints)

**Test Command**:
```bash
curl http://localhost:3001/api
```

---

### Phase 6C.3: Production Authentication System

#### Test Scenario 6C.3.1: User Signup - Business Account

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: User makes POST request to `/api/auth/signup` with:
```json
{
  "email": "test@company.ro",
  "password": "securepass123",
  "name": "Test User",
  "phone": "+40722123456",
  "role": "BUSINESS",
  "company": {
    "name": "Test Company SRL",
    "cui": "RO12345678",
    "address": "Str. Test 123",
    "city": "București",
    "county": "București",
    "postalCode": "010101"
  }
}
```

**Then**:
- [ ] Response status code is 201
- [ ] Response contains `"success": true`
- [ ] Response contains `"data"` object with:
  - user object (without passwordHash)
  - tokens object with accessToken and refreshToken
- [ ] User object includes company information
- [ ] User ID is a valid UUID
- [ ] Email is stored in lowercase
- [ ] Password is NOT visible in response

**Test Command**:
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.ro",
    "password": "securepass123",
    "name": "Test User",
    "phone": "+40722123456",
    "role": "BUSINESS",
    "company": {
      "name": "Test Company SRL",
      "cui": "RO12345678",
      "address": "Str. Test 123",
      "city": "București",
      "county": "București",
      "postalCode": "010101"
    }
  }'
```

**Database Verification**:
- [ ] User record created in `users` table
- [ ] Password is bcrypt-hashed (starts with $2b$ and is 60 chars long)
- [ ] Company record created in `companies` table
- [ ] Session record created in `sessions` table with access and refresh tokens

---

#### Test Scenario 6C.3.2: User Signup - Individual Account

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: User makes POST request to `/api/auth/signup` with:
```json
{
  "email": "individual@test.ro",
  "password": "mypassword123",
  "name": "Individual User",
  "role": "INDIVIDUAL"
}
```

**Then**:
- [ ] Response status code is 201
- [ ] User created without company information
- [ ] Tokens generated successfully
- [ ] User role is "INDIVIDUAL"

**Test Command**:
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "individual@test.ro",
    "password": "mypassword123",
    "name": "Individual User",
    "role": "INDIVIDUAL"
  }'
```

---

#### Test Scenario 6C.3.3: User Signup - Validation Errors

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: Backend server is running

**When**: User attempts signup with missing required fields

**Then**:
- [ ] Response status code is 400
- [ ] Response contains error message indicating required fields

**When**: User attempts signup with password < 8 characters

**Then**:
- [ ] Response status code is 400
- [ ] Response contains error: "Parola trebuie să conțină cel puțin 8 caractere"

**When**: User attempts signup with duplicate email

**Then**:
- [ ] Response status code is 400
- [ ] Response contains error: "Un cont cu acest email există deja."

**Test Commands**:
```bash
# Missing required fields
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.ro"}'

# Short password
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "short@test.ro",
    "password": "short",
    "name": "Test",
    "role": "INDIVIDUAL"
  }'

# Duplicate email (use email from previous signup)
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.ro",
    "password": "password123",
    "name": "Duplicate",
    "role": "INDIVIDUAL"
  }'
```

---

#### Test Scenario 6C.3.4: User Login - Successful

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: User account exists with email "test@company.ro" and password "securepass123"

**When**: User makes POST request to `/api/auth/login` with:
```json
{
  "email": "test@company.ro",
  "password": "securepass123"
}
```

**Then**:
- [ ] Response status code is 200
- [ ] Response contains `"success": true`
- [ ] Response contains user object with company information
- [ ] Response contains new JWT tokens (different from signup tokens)
- [ ] Session created in database
- [ ] User object does NOT contain passwordHash

**Test Command**:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.ro",
    "password": "securepass123"
  }'
```

**Save the accessToken from response for next tests!**

---

#### Test Scenario 6C.3.5: User Login - Failed Authentication

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User account exists

**When**: User attempts login with wrong password

**Then**:
- [ ] Response status code is 401
- [ ] Response contains `"success": false`
- [ ] Response contains error: "Email sau parolă incorectă."

**When**: User attempts login with non-existent email

**Then**:
- [ ] Response status code is 401
- [ ] Response contains error: "Email sau parolă incorectă."

**When**: User attempts login with missing credentials

**Then**:
- [ ] Response status code is 400
- [ ] Response contains error message

**Test Commands**:
```bash
# Wrong password
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.ro",
    "password": "wrongpassword"
  }'

# Non-existent email
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@test.ro",
    "password": "anypassword"
  }'
```

---

#### Test Scenario 6C.3.6: Get Current User (Authenticated)

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: User is logged in and has a valid access token

**When**: User makes GET request to `/api/users/me` with Authorization header:
```
Authorization: Bearer {accessToken}
```

**Then**:
- [ ] Response status code is 200
- [ ] Response contains user information
- [ ] Response includes company information (if business account)
- [ ] Response does NOT include passwordHash

**When**: User makes request without Authorization header

**Then**:
- [ ] Response status code is 401
- [ ] Response contains error: "Unauthorized - No token provided"

**When**: User makes request with invalid token

**Then**:
- [ ] Response status code is 401
- [ ] Response contains error: "Invalid token"

**Test Commands**:
```bash
# With valid token
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer {PASTE_YOUR_ACCESS_TOKEN_HERE}"

# Without token
curl -X GET http://localhost:3001/api/users/me

# With invalid token
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer invalid.token.here"
```

---

#### Test Scenario 6C.3.7: Update User Profile

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User is logged in with valid access token

**When**: User makes PATCH request to `/api/users/me` with:
```json
{
  "name": "Updated Name",
  "phone": "+40722999888"
}
```

**Then**:
- [ ] Response status code is 200
- [ ] Response contains updated user object
- [ ] User name is changed to "Updated Name"
- [ ] User phone is changed to "+40722999888"
- [ ] updatedAt timestamp is updated
- [ ] Other fields remain unchanged

**Test Command**:
```bash
curl -X PATCH http://localhost:3001/api/users/me \
  -H "Authorization: Bearer {PASTE_YOUR_ACCESS_TOKEN_HERE}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "+40722999888"
  }'
```

---

#### Test Scenario 6C.3.8: Update Company Information

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User is logged in (business account) with valid access token

**When**: User makes PATCH request to `/api/users/me/company` with:
```json
{
  "legalName": "Updated Company SRL",
  "address": "New Address 123",
  "city": "Cluj-Napoca"
}
```

**Then**:
- [ ] Response status code is 200
- [ ] Response contains updated company object
- [ ] Company legalName is updated
- [ ] Company address is updated
- [ ] Company city is updated
- [ ] Other company fields remain unchanged

**When**: Individual user (no company) makes same request

**Then**:
- [ ] New company record is created for the user
- [ ] Company fields are set from request

**Test Command**:
```bash
curl -X PATCH http://localhost:3001/api/users/me/company \
  -H "Authorization: Bearer {PASTE_YOUR_ACCESS_TOKEN_HERE}" \
  -H "Content-Type: application/json" \
  -d '{
    "legalName": "Updated Company SRL",
    "address": "New Address 123",
    "city": "Cluj-Napoca"
  }'
```

---

#### Test Scenario 6C.3.9: Token Refresh

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: User has a valid refresh token from login/signup

**When**: User makes POST request to `/api/auth/refresh` with:
```json
{
  "refreshToken": "{REFRESH_TOKEN}"
}
```

**Then**:
- [ ] Response status code is 200
- [ ] Response contains new accessToken
- [ ] Response contains new refreshToken
- [ ] Response contains user object
- [ ] Old refresh token is invalidated
- [ ] New session is created/updated in database

**When**: User provides invalid or expired refresh token

**Then**:
- [ ] Response status code is 401
- [ ] Response contains error: "Invalid or expired refresh token"

**Test Commands**:
```bash
# With valid refresh token
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "{PASTE_YOUR_REFRESH_TOKEN_HERE}"
  }'

# With invalid refresh token
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "invalid.refresh.token"
  }'
```

---

#### Test Scenario 6C.3.10: User Logout

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: User is logged in with valid access token

**When**: User makes POST request to `/api/auth/logout` with Authorization header

**Then**:
- [ ] Response status code is 200
- [ ] Response contains success message: "Logged out successfully"
- [ ] Session is deleted from database
- [ ] Access token is invalidated

**When**: User attempts to use the same access token after logout

**Then**:
- [ ] Request is rejected with 401 status
- [ ] Error message: "Session expired or invalid"

**Test Commands**:
```bash
# Logout
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer {PASTE_YOUR_ACCESS_TOKEN_HERE}"

# Try to use token after logout
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer {SAME_ACCESS_TOKEN}"
```

---

#### Test Scenario 6C.3.11: JWT Token Expiration

**Priority**: Medium
**Estimated Time**: 5 minutes

**Given**: Access token expires in 24 hours (configured in .env)

**When**: User uses an expired access token

**Then**:
- [ ] Response status code is 401
- [ ] Response contains error indicating token expiration

**Note**: To test this properly, either:
1. Temporarily change `JWT_EXPIRES_IN=10s` in .env and wait 10 seconds
2. Manually create an expired token with past expiration time

---

#### Test Scenario 6C.3.12: Password Security Verification

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User has signed up

**When**: Tester inspects database directly

**Then**:
- [ ] Password in database is bcrypt-hashed (starts with `$2b$`)
- [ ] Hash is 60 characters long
- [ ] Original password is NOT stored anywhere
- [ ] Salt rounds = 12 (configurable in code)

**When**: User signs up with same password twice

**Then**:
- [ ] Two different password hashes are generated (bcrypt uses random salt)

**Database Check Command**:
```bash
# Connect to database
docker exec -it steel-craft-flow-postgres-1 psql -U metalpro_user -d metalpro

# Check password hashes
SELECT email, "passwordHash" FROM users;
```

---

#### Test Scenario 6C.3.13: Session Management

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: User has logged in

**When**: Tester checks sessions table in database

**Then**:
- [ ] Session record exists with userId
- [ ] Session contains access token
- [ ] Session contains refresh token
- [ ] Session has expiresAt timestamp (7 days from creation)

**When**: User logs out

**Then**:
- [ ] Session record is deleted from database

**When**: User refreshes token

**Then**:
- [ ] Session record is updated with new tokens
- [ ] expiresAt is extended

**Database Check Commands**:
```bash
# Connect to database
docker exec -it steel-craft-flow-postgres-1 psql -U metalpro_user -d metalpro

# Check sessions
SELECT id, "userId", "expiresAt", "createdAt" FROM sessions;
```

---

#### Test Scenario 6C.3.14: CORS Configuration

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running with CORS enabled

**When**: Request is made from allowed origin (http://localhost:8080)

**Then**:
- [ ] Request succeeds
- [ ] Response includes CORS headers:
  - Access-Control-Allow-Origin: http://localhost:8080
  - Access-Control-Allow-Credentials: true

**When**: Request is made from different origin

**Then**:
- [ ] Request may be blocked by browser (depending on configuration)

**Test Command**:
```bash
# Check CORS headers
curl -I http://localhost:3001/api -H "Origin: http://localhost:8080"
```

---

#### Test Scenario 6C.3.15: Request Logging

**Priority**: Low
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: Any API request is made

**Then**:
- [ ] Request is logged to console
- [ ] Log includes timestamp in ISO format
- [ ] Log includes HTTP method (GET, POST, etc.)
- [ ] Log includes request path

**Check server console output for entries like:**
```
[2025-11-15T10:44:23.568Z] POST /api/auth/login
[2025-11-15T10:44:30.123Z] GET /api/users/me
```

---

### Phase 6C.4: File Upload & Storage

#### Test Scenario 6C.4.1: BOM File Upload - Guest User

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: Guest user uploads a BOM file (CSV format)

**Then**:
- [ ] Response status code is 201
- [ ] Response contains `"success": true`
- [ ] Response contains `"message": "Fișier BOM încărcat cu succes"`
- [ ] Response contains file metadata:
  - fileId (UUID)
  - fileName (original filename)
  - filePath (server path)
  - fileUrl (accessible URL)
  - mimeType
  - size (in bytes)
- [ ] File is saved to `uploads/bom-uploads/guest/` directory
- [ ] File URL is accessible via browser/curl

**Test Commands**:
```bash
# Create test BOM file
echo "Product,Quantity,Dimensions
HEA 200,10,200mm
Table 10mm,5,2000x1000mm" > /tmp/test-bom.csv

# Upload file
curl -X POST http://localhost:3001/api/upload/bom \
  -F "file=@/tmp/test-bom.csv"

# Access uploaded file (use URL from response)
curl http://localhost:3001/uploads/bom-uploads/guest/{fileId}-test-bom.csv
```

**Verify on Disk**:
```bash
ls -lh /Users/rdraghici/Desktop/Study/MetalPro/MetalPro/steel-craft-flow/backend/uploads/bom-uploads/guest/
```

---

#### Test Scenario 6C.4.2: BOM File Upload - Authenticated User

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User is logged in with valid access token

**When**: Authenticated user uploads a BOM file

**Then**:
- [ ] Response status code is 201
- [ ] File is saved to `uploads/bom-uploads/{userId}/` directory (not guest folder)
- [ ] File URL includes user ID in path
- [ ] File is accessible via returned URL

**Test Commands**:
```bash
# Login first
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@metalpro.ro","password":"testpassword123"}' \
  | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

# Upload with authentication
curl -X POST http://localhost:3001/api/upload/bom \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test-bom.csv"
```

---

#### Test Scenario 6C.4.3: BOM File Upload - Excel Format

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: User uploads an Excel file (.xlsx)

**Then**:
- [ ] Upload succeeds for .xlsx files
- [ ] Upload succeeds for .xls files
- [ ] Response contains correct mimeType

**Test Commands**:
```bash
# For this test, use an actual Excel file
# Example with curl:
curl -X POST http://localhost:3001/api/upload/bom \
  -F "file=@/path/to/sample.xlsx"
```

**Note**: Create a sample Excel file with product data to test.

---

#### Test Scenario 6C.4.4: BOM File Upload - File Type Validation

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: Backend server is running

**When**: User attempts to upload invalid file types

**Then**:
- [ ] .exe files are rejected
- [ ] .zip files are rejected
- [ ] .js files are rejected
- [ ] Error message: "Format fișier invalid. Acceptăm doar: .xlsx, .xls, .csv, .txt"
- [ ] Response status code is 400

**When**: User uploads valid file types

**Then**:
- [ ] .csv files are accepted
- [ ] .txt files are accepted
- [ ] .xlsx files are accepted
- [ ] .xls files are accepted

**Test Commands**:
```bash
# Test invalid file type
echo "Test" > /tmp/test.exe
curl -X POST http://localhost:3001/api/upload/bom \
  -F "file=@/tmp/test.exe"

# Should return error: Format fișier invalid...

# Test valid file type
echo "Product,Qty" > /tmp/test.csv
curl -X POST http://localhost:3001/api/upload/bom \
  -F "file=@/tmp/test.csv"

# Should succeed
```

---

#### Test Scenario 6C.4.5: BOM File Upload - File Size Validation

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: User uploads a file larger than 10MB

**Then**:
- [ ] Response status code is 400
- [ ] Response contains error: "Fișierul este prea mare. Dimensiunea maximă: 10MB"
- [ ] File is not saved to disk

**When**: User uploads a file under 10MB

**Then**:
- [ ] Upload succeeds
- [ ] File is saved normally

**Test Commands**:
```bash
# Create large file (11MB)
dd if=/dev/zero of=/tmp/large-bom.csv bs=1M count=11

# Try to upload
curl -X POST http://localhost:3001/api/upload/bom \
  -F "file=@/tmp/large-bom.csv"

# Should return error: Fișierul este prea mare...

# Create normal size file (1MB)
dd if=/dev/zero of=/tmp/normal-bom.csv bs=1M count=1

# Upload should succeed
curl -X POST http://localhost:3001/api/upload/bom \
  -F "file=@/tmp/normal-bom.csv"
```

---

#### Test Scenario 6C.4.6: BOM File Upload - Missing File

**Priority**: Medium
**Estimated Time**: 1 minute

**Given**: Backend server is running

**When**: User submits upload request without a file

**Then**:
- [ ] Response status code is 400
- [ ] Response contains error: "Nu a fost furnizat niciun fișier"

**Test Command**:
```bash
curl -X POST http://localhost:3001/api/upload/bom

# Should return: Nu a fost furnizat niciun fișier
```

---

#### Test Scenario 6C.4.7: RFQ Attachment Upload - PDF File

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: User uploads a PDF attachment for an RFQ

**Then**:
- [ ] Response status code is 201
- [ ] Response contains `"success": true`
- [ ] Response contains `"message": "Atașament încărcat cu succes"`
- [ ] File is saved to `uploads/rfq-attachments/{rfqId}/` directory
- [ ] File URL is accessible

**Test Commands**:
```bash
# Create test PDF file
echo "Test attachment content" > /tmp/test-attachment.pdf

# Upload attachment
curl -X POST http://localhost:3001/api/upload/attachment \
  -F "file=@/tmp/test-attachment.pdf" \
  -F "rfqId=test-rfq-123"

# Verify file saved
ls -lh /Users/rdraghici/Desktop/Study/MetalPro/MetalPro/steel-craft-flow/backend/uploads/rfq-attachments/test-rfq-123/
```

---

#### Test Scenario 6C.4.8: RFQ Attachment Upload - Image Files

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: User uploads image attachments (JPG, PNG, GIF)

**Then**:
- [ ] .jpg files are accepted
- [ ] .jpeg files are accepted
- [ ] .png files are accepted
- [ ] .gif files are accepted
- [ ] Correct mimeType is detected

**Test Commands**:
```bash
# For this test, use actual image files
# Example:
curl -X POST http://localhost:3001/api/upload/attachment \
  -F "file=@/path/to/image.jpg" \
  -F "rfqId=test-rfq-456"
```

---

#### Test Scenario 6C.4.9: RFQ Attachment Upload - Document Files

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: User uploads document attachments (DOC, DOCX)

**Then**:
- [ ] .doc files are accepted
- [ ] .docx files are accepted
- [ ] Files are saved correctly

**Test Commands**:
```bash
# Use actual Word documents for testing
curl -X POST http://localhost:3001/api/upload/attachment \
  -F "file=@/path/to/document.docx" \
  -F "rfqId=test-rfq-789"
```

---

#### Test Scenario 6C.4.10: RFQ Attachment Upload - Missing RFQ ID

**Priority**: Medium
**Estimated Time**: 1 minute

**Given**: Backend server is running

**When**: User uploads attachment without providing rfqId

**Then**:
- [ ] Response status code is 400
- [ ] Response contains error: "rfqId este necesar"

**Test Command**:
```bash
curl -X POST http://localhost:3001/api/upload/attachment \
  -F "file=@/tmp/test-attachment.pdf"

# Should return: rfqId este necesar
```

---

#### Test Scenario 6C.4.11: RFQ Attachment Upload - File Type Validation

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: User attempts to upload invalid file types as attachments

**Then**:
- [ ] .exe files are rejected
- [ ] .zip files are rejected
- [ ] .txt files are rejected (not in allowed list)
- [ ] Error message: "Format fișier invalid. Acceptăm: PDF, JPG, PNG, GIF, DOC, DOCX"
- [ ] Response status code is 400

**Test Commands**:
```bash
# Test invalid file type
echo "Test" > /tmp/test.exe
curl -X POST http://localhost:3001/api/upload/attachment \
  -F "file=@/tmp/test.exe" \
  -F "rfqId=test-rfq-123"

# Should return error: Format fișier invalid...
```

---

#### Test Scenario 6C.4.12: RFQ Attachment Upload - File Size Validation

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: User uploads an attachment larger than 5MB

**Then**:
- [ ] Response status code is 400
- [ ] Response contains error: "Fișierul este prea mare. Dimensiunea maximă: 5MB"

**Test Commands**:
```bash
# Create large file (6MB)
dd if=/dev/zero of=/tmp/large-attachment.pdf bs=1M count=6

# Try to upload
curl -X POST http://localhost:3001/api/upload/attachment \
  -F "file=@/tmp/large-attachment.pdf" \
  -F "rfqId=test-rfq-123"

# Should return: Fișierul este prea mare...
```

---

#### Test Scenario 6C.4.13: File Access via Static URL

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: Files have been uploaded successfully

**When**: User accesses file via returned URL

**Then**:
- [ ] BOM files are accessible via `/uploads/bom-uploads/...`
- [ ] Attachment files are accessible via `/uploads/rfq-attachments/...`
- [ ] Browser can download/display files
- [ ] Correct Content-Type headers are sent
- [ ] Files are served without authentication (public access)

**Test Commands**:
```bash
# After uploading a file, use the returned fileUrl
# Example:
curl http://localhost:3001/uploads/bom-uploads/guest/{fileId}-test-bom.csv

# Should return file contents

# Test in browser by pasting URL
```

---

#### Test Scenario 6C.4.14: File Organization Structure

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: Multiple files have been uploaded by different users and for different RFQs

**When**: Tester inspects uploads directory

**Then**:
- [ ] Directory structure exists:
  - `uploads/bom-uploads/guest/`
  - `uploads/bom-uploads/{userId}/` (for each authenticated user)
  - `uploads/rfq-attachments/{rfqId}/` (for each RFQ)
- [ ] Files are organized correctly
- [ ] File names include UUID prefix to prevent collisions
- [ ] Original filenames are preserved in response metadata

**Verification Commands**:
```bash
# Check directory structure
tree uploads/

# Or with ls
ls -lR uploads/
```

---

#### Test Scenario 6C.4.15: Multiple File Uploads for Same RFQ

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: User uploads multiple attachments for the same RFQ

**Then**:
- [ ] All files are saved to same RFQ folder
- [ ] Each file has unique UUID prefix
- [ ] No file overwrites occur
- [ ] All files are accessible via their URLs

**Test Commands**:
```bash
# Upload first attachment
curl -X POST http://localhost:3001/api/upload/attachment \
  -F "file=@/tmp/attachment1.pdf" \
  -F "rfqId=test-rfq-999"

# Upload second attachment
curl -X POST http://localhost:3001/api/upload/attachment \
  -F "file=@/tmp/attachment2.jpg" \
  -F "rfqId=test-rfq-999"

# Upload third attachment
curl -X POST http://localhost:3001/api/upload/attachment \
  -F "file=@/tmp/attachment3.png" \
  -F "rfqId=test-rfq-999"

# Verify all files exist
ls -lh uploads/rfq-attachments/test-rfq-999/

# Should show 3 files with different UUID prefixes
```

---

#### Test Scenario 6C.4.16: Upload Performance Test

**Priority**: Low
**Estimated Time**: 5 minutes

**Given**: Backend server is running

**When**: User uploads files of various sizes

**Then**:
- [ ] Small files (<100KB) upload in <1 second
- [ ] Medium files (1-5MB) upload in <5 seconds
- [ ] Large files (5-10MB) upload in <15 seconds
- [ ] Server remains responsive during uploads
- [ ] Memory usage stays reasonable

**Test Commands**:
```bash
# Create files of different sizes
dd if=/dev/zero of=/tmp/small.csv bs=1K count=50
dd if=/dev/zero of=/tmp/medium.csv bs=1M count=3
dd if=/dev/zero of=/tmp/large.csv bs=1M count=8

# Upload and time each
time curl -X POST http://localhost:3001/api/upload/bom \
  -F "file=@/tmp/small.csv"

time curl -X POST http://localhost:3001/api/upload/bom \
  -F "file=@/tmp/medium.csv"

time curl -X POST http://localhost:3001/api/upload/bom \
  -F "file=@/tmp/large.csv"
```

---

### Phase 6C Summary - Quick Checklist

#### Phase 6C.1: Backend API Setup (4 scenarios)
- [ ] 6C.1.1 - Infrastructure Health Check
- [ ] 6C.1.2 - Database Connection Verification
- [ ] 6C.1.3 - Redis Cache Connection
- [ ] 6C.1.4 - Database Seeding Verification

#### Phase 6C.2: Route Scaffolding (5 scenarios)
- [ ] 6C.2.1 - Products API - List All Products
- [ ] 6C.2.2 - Products API - Get Single Product
- [ ] 6C.2.3 - Categories API - List All Categories
- [ ] 6C.2.4 - Categories API - Get Single Category
- [ ] 6C.2.5 - API Base Info Endpoint

#### Phase 6C.3: Production Authentication System (15 scenarios)
- [ ] 6C.3.1 - User Signup - Business Account
- [ ] 6C.3.2 - User Signup - Individual Account
- [ ] 6C.3.3 - User Signup - Validation Errors
- [ ] 6C.3.4 - User Login - Successful
- [ ] 6C.3.5 - User Login - Failed Authentication
- [ ] 6C.3.6 - Get Current User (Authenticated)
- [ ] 6C.3.7 - Update User Profile
- [ ] 6C.3.8 - Update Company Information
- [ ] 6C.3.9 - Token Refresh
- [ ] 6C.3.10 - User Logout
- [ ] 6C.3.11 - JWT Token Expiration
- [ ] 6C.3.12 - Password Security Verification
- [ ] 6C.3.13 - Session Management
- [ ] 6C.3.14 - CORS Configuration
- [ ] 6C.3.15 - Request Logging

#### Phase 6C.4: File Upload & Storage (16 scenarios)
- [ ] 6C.4.1 - BOM File Upload - Guest User
- [ ] 6C.4.2 - BOM File Upload - Authenticated User
- [ ] 6C.4.3 - BOM File Upload - Excel Format
- [ ] 6C.4.4 - BOM File Upload - File Type Validation
- [ ] 6C.4.5 - BOM File Upload - File Size Validation
- [ ] 6C.4.6 - BOM File Upload - Missing File
- [ ] 6C.4.7 - RFQ Attachment Upload - PDF File
- [ ] 6C.4.8 - RFQ Attachment Upload - Image Files
- [ ] 6C.4.9 - RFQ Attachment Upload - Document Files
- [ ] 6C.4.10 - RFQ Attachment Upload - Missing RFQ ID
- [ ] 6C.4.11 - RFQ Attachment Upload - File Type Validation
- [ ] 6C.4.12 - RFQ Attachment Upload - File Size Validation
- [ ] 6C.4.13 - File Access via Static URL
- [ ] 6C.4.14 - File Organization Structure
- [ ] 6C.4.15 - Multiple File Uploads for Same RFQ
- [ ] 6C.4.16 - Upload Performance Test

**Total Phase 6C Scenarios**: 40 scenarios

**Next Review**: Before production release

---

### Phase 6C.5: Email Service Integration (AWS SES)

#### Test Scenario 6C.5.1: Email Service - Development Mode

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: Backend server is running without AWS credentials

**When**: Email service initializes

**Then**:
- [ ] Server logs show: "📧 Email service running in DEVELOPMENT mode (no AWS credentials)"
- [ ] Server logs show: "📧 Emails will be logged to console instead of being sent via SES"
- [ ] Server starts successfully without errors

**Verification**:
```bash
# Check server startup logs
# Should see development mode messages
```

---

#### Test Scenario 6C.5.2: RFQ Confirmation Email - Test Endpoint

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: Backend server is running in development mode

**When**: Testing RFQ confirmation email

**Then**:
- [ ] Response status code is 200
- [ ] Response contains `"success": true`
- [ ] Response contains `"message": "Email de confirmare RFQ trimis cu succes..."`
- [ ] Server console logs email details:
  - To: recipient email
  - From: noreply@metalpro.ro
  - Subject: Confirmare RFQ RFQ-2025-XXXXX - MetalPro
- [ ] Email HTML template is well-formed

**Test Commands**:
```bash
# Test RFQ confirmation email
curl -X POST http://localhost:3001/api/email-test/rfq-confirmation \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check server console for email log output
```

---

#### Test Scenario 6C.5.3: Operator Notification Email - Test Endpoint

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: Testing operator notification email

**Then**:
- [ ] Response status code is 200
- [ ] Email is sent to OPERATOR_EMAIL address (sales@metalpro.ro)
- [ ] Email contains RFQ details (reference number, company, contact person)
- [ ] Email includes "Acțiune necesară" urgent notice
- [ ] Server console logs email details

**Test Commands**:
```bash
# Test operator notification
curl -X POST http://localhost:3001/api/email-test/operator-notification

# Check console logs for operator email details
```

---

#### Test Scenario 6C.5.4: Email Verification Email - Test Endpoint

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: Testing email verification

**Then**:
- [ ] Response status code is 200
- [ ] Email contains verification link with token
- [ ] Link format: `{FRONTEND_URL}/verify-email?token={token}`
- [ ] Email includes 24-hour expiration notice
- [ ] Subject: "Verifică adresa de email - MetalPro"

**Test Commands**:
```bash
# Test email verification
curl -X POST http://localhost:3001/api/email-test/email-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com"}'
```

---

#### Test Scenario 6C.5.5: Password Reset Email - Test Endpoint

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: Testing password reset email

**Then**:
- [ ] Response status code is 200
- [ ] Email contains password reset link with token
- [ ] Link format: `{FRONTEND_URL}/reset-password?token={token}`
- [ ] Email includes 1-hour expiration notice
- [ ] Email includes security warning
- [ ] Subject: "Resetare Parolă - MetalPro"

**Test Commands**:
```bash
# Test password reset email
curl -X POST http://localhost:3001/api/email-test/password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

---

#### Test Scenario 6C.5.6: Quote Ready Email - Test Endpoint

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: Testing quote ready notification

**Then**:
- [ ] Response status code is 200
- [ ] Email contains quote reference number
- [ ] Email displays final quote amount prominently
- [ ] Email includes PDF download link
- [ ] Email includes contact information
- [ ] Subject: "Ofertă Pregătită - RFQ-2025-XXXXX"

**Test Commands**:
```bash
# Test quote ready email
curl -X POST http://localhost:3001/api/email-test/quote-ready \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com"}'
```

---

#### Test Scenario 6C.5.7: All Email Types - Comprehensive Test

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: Testing all email types at once

**Then**:
- [ ] Response status code is 200
- [ ] Response contains results for all 5 email types
- [ ] All email types show `"status": "success"`
- [ ] Server console shows 5 email logs:
  1. RFQ Confirmation
  2. Operator Notification
  3. Email Verification
  4. Password Reset
  5. Quote Ready

**Test Commands**:
```bash
# Test all email types
curl -X POST http://localhost:3001/api/email-test/all \
  -H "Content-Type: application/json" \
  -d '{"email":"test@metalpro.ro"}'

# Expected response:
# {
#   "success": true,
#   "message": "Toate testele de email au fost executate",
#   "data": {
#     "recipient": "test@metalpro.ro",
#     "results": [
#       {"type": "RFQ Confirmation", "status": "success"},
#       {"type": "Operator Notification", "status": "success"},
#       {"type": "Email Verification", "status": "success"},
#       {"type": "Password Reset", "status": "success"},
#       {"type": "Quote Ready", "status": "success"}
#     ]
#   }
# }
```

---

#### Test Scenario 6C.5.8: Email Template - HTML Structure

**Priority**: Medium
**Estimated Time**: 5 minutes

**Given**: Email test has been executed

**When**: Inspecting email HTML in console logs

**Then**:
- [ ] All emails use proper HTML structure with DOCTYPE
- [ ] Emails include inline CSS for email client compatibility
- [ ] Emails are mobile-responsive (max-width: 600px)
- [ ] All emails include MetalPro branding
- [ ] All emails include footer with disclaimer
- [ ] Links use proper formatting and colors
- [ ] Special characters (Romanian: ă, â, î, ș, ț) display correctly

**Manual Verification**:
Copy HTML from console logs and open in browser to verify rendering.

---

### Phase 6C.6: Security Hardening

#### Test Scenario 6C.6.1: Rate Limiting - General API

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: Making multiple requests to /api/products

**Then**:
- [ ] First 100 requests within 15 minutes succeed
- [ ] Response headers include:
  - `RateLimit-Policy`
  - `RateLimit-Limit: 100`
  - `RateLimit-Remaining` (decreases with each request)
  - `RateLimit-Reset` (seconds until reset)
- [ ] 101st request returns HTTP 429 (Too Many Requests)
- [ ] Error message: "Too many requests"

**Test Commands**:
```bash
# Make 5 requests and check headers
for i in {1..5}; do
  echo "Request $i:"
  curl -v http://localhost:3001/api/products 2>&1 | grep -i ratelimit
  echo ""
done

# Check remaining count decreases
```

---

#### Test Scenario 6C.6.2: Rate Limiting - Authentication Endpoints (Strict)

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: Making multiple failed login attempts

**Then**:
- [ ] First 5 login attempts are processed (may fail with wrong credentials)
- [ ] 6th attempt returns HTTP 429 (Too Many Requests)
- [ ] Error response: `{"error":"Too many authentication attempts","message":"..."}`
- [ ] Rate limit resets after 15 minutes

**Test Commands**:
```bash
# Make 6 login attempts
for i in {1..6}; do
  echo "Login attempt $i:"
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrongpass"}' \
    -w "\nHTTP Status: %{http_code}\n\n"
done

# 6th attempt should return 429
```

**Expected Output**:
```
Login attempt 6:
{"error":"Too many authentication attempts","message":"Too many authentication attempts from this IP, please try again after 15 minutes."}
HTTP Status: 429
```

---

#### Test Scenario 6C.6.3: Rate Limiting - File Upload Endpoints

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: Uploading files rapidly

**Then**:
- [ ] First 20 uploads within 1 hour succeed
- [ ] 21st upload returns HTTP 429
- [ ] Error message: "Too many file uploads"

**Test Commands**:
```bash
# Create test file
echo "test" > /tmp/test.csv

# Make multiple upload requests
for i in {1..3}; do
  curl -X POST http://localhost:3001/api/upload/bom \
    -F "file=@/tmp/test.csv" \
    -w "\nHTTP Status: %{http_code}\n"
done
```

---

#### Test Scenario 6C.6.4: Rate Limiting - RFQ Submission

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: Submitting multiple RFQ requests

**Then**:
- [ ] First 10 RFQ submissions within 1 hour are allowed
- [ ] 11th submission returns HTTP 429
- [ ] Error message: "Too many RFQ submissions"

---

#### Test Scenario 6C.6.5: Health Check - Rate Limit Bypass

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: IP address has exceeded rate limits

**When**: Accessing /health endpoint

**Then**:
- [ ] Health check endpoint always works (bypasses rate limiter)
- [ ] Returns HTTP 200 even when rate limited
- [ ] Response contains system health status

**Test Commands**:
```bash
# After triggering rate limit, health check should still work
curl http://localhost:3001/health

# Should return 200 with health status
```

---

#### Test Scenario 6C.6.6: XSS Protection - Script Tag Sanitization

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: Submitting request with XSS payload

**Then**:
- [ ] Input containing `<script>` tags is sanitized
- [ ] Special characters are escaped:
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#x27;`
  - `/` → `&#x2F;`
- [ ] No script execution in responses

**Test Commands**:
```bash
# Test XSS in login endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<script>alert(\"XSS\")</script>","password":"test"}'

# Check response - should not contain unescaped script tags
```

---

#### Test Scenario 6C.6.7: MongoDB Injection Protection

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: Submitting request with MongoDB operators

**Then**:
- [ ] MongoDB operators are sanitized:
  - `$ne` is removed/replaced
  - `$gt` is removed/replaced
  - `$lt` is removed/replaced
  - Dot notation in keys is replaced
- [ ] Server logs warning: "[Security] Sanitized MongoDB operator from request"
- [ ] Request is processed with sanitized data

**Test Commands**:
```bash
# Test MongoDB injection attempt
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$ne":""},"password":"test"}'

# Check server logs for sanitization warning
# Request should fail authentication (not bypass with $ne)
```

---

#### Test Scenario 6C.6.8: Environment Variable Validation

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: Backend server is starting

**When**: Server initializes

**Then**:
- [ ] Server validates all required environment variables
- [ ] Server logs: "✅ Environment validation passed"
- [ ] Server logs environment details:
  - Environment (development/production)
  - JWT Secret length
  - Email service status
- [ ] Server fails to start if critical variables are missing

**Verification**:
```bash
# Check server startup logs for validation messages:
# ✅ Environment validation passed
# 📍 Environment: development
# 🔐 JWT Secret: your-super... (64 characters)
# 📧 Email Service: Not configured (development mode)
```

---

#### Test Scenario 6C.6.9: Error Handling - Production Mode

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: Server is running in production mode (NODE_ENV=production)

**When**: An internal server error occurs

**Then**:
- [ ] Error response does not expose stack trace
- [ ] Error response is generic: "An unexpected error occurred. Please try again later."
- [ ] Detailed error is logged server-side only
- [ ] HTTP status code is appropriate (500, 400, etc.)

**When**: Server is in development mode

**Then**:
- [ ] Error response includes detailed information
- [ ] Stack trace is included in response
- [ ] Request path and method are included

---

#### Test Scenario 6C.6.10: Security Headers - Helmet.js

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: Making any API request

**Then**:
- [ ] Response includes security headers:
  - `X-DNS-Prefetch-Control`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `X-Download-Options`
  - `Strict-Transport-Security`
- [ ] CORS headers are present:
  - `Access-Control-Allow-Origin`
  - `Access-Control-Allow-Methods`

**Test Commands**:
```bash
# Check security headers
curl -v http://localhost:3001/api/products 2>&1 | grep -i "x-"

# Should see various X- security headers
```

---

#### Test Scenario 6C.6.11: CORS Configuration

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: Backend server is running with FRONTEND_URL=http://localhost:8080

**When**: Making request from allowed origin

**Then**:
- [ ] Request succeeds
- [ ] CORS headers allow the origin

**When**: Making request from disallowed origin

**Then**:
- [ ] Request is blocked by CORS policy
- [ ] Browser console shows CORS error

**Test Commands**:
```bash
# Test with allowed origin
curl -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS \
  http://localhost:3001/api/products

# Should return CORS headers allowing the request
```

---

#### Test Scenario 6C.6.12: Input Sanitization - Comprehensive Test

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: Backend server is running

**When**: Submitting various malicious inputs

**Then**:
- [ ] SQL injection attempts are blocked (via Prisma parameterization)
- [ ] XSS attempts are sanitized
- [ ] MongoDB injection attempts are sanitized
- [ ] File upload validation prevents dangerous file types
- [ ] All inputs are properly validated and sanitized

**Test Commands**:
```bash
# Run the security test suite
chmod +x test-security.sh
./test-security.sh

# Should show:
# ✓ Environment validation
# ✓ API rate limiting (100 req/15min)
# ✓ Auth rate limiting (5 req/15min)
# ✓ XSS protection
# ✓ MongoDB injection protection
# ✓ Secure error handling
# ✓ Health check bypass
# ✓ Rate limit headers
```

---

### Phase 6C.8: Monitoring & Logging

---

#### Test Scenario 6C.8.1: Health Check - Comprehensive Status

**Priority**: Critical
**Estimated Time**: 2 minutes

**Given**: Backend server is running with database and Redis connected

**When**: Making a GET request to `/health`

**Then**:
- [ ] Response status is 200 OK
- [ ] Response includes `status: "healthy"`
- [ ] Response includes `service: "MetalPro Backend API"`
- [ ] Response includes current environment
- [ ] Response includes uptime in seconds
- [ ] Response includes database check: "connected"
- [ ] Response includes redis check: "connected"

**Test Commands**:
```bash
# Test health check
curl http://localhost:3001/health | jq

# Expected response:
# {
#   "status": "healthy",
#   "service": "MetalPro Backend API",
#   "environment": "development",
#   "timestamp": "2025-11-15T10:30:45.123Z",
#   "uptime": 3600,
#   "checks": {
#     "database": "connected",
#     "redis": "connected"
#   }
# }
```

---

#### Test Scenario 6C.8.2: Health Check - Degraded State

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Backend server is running but database is unavailable

**When**: Making a GET request to `/health`

**Then**:
- [ ] Response status is 503 Service Unavailable
- [ ] Response includes `status: "degraded"`
- [ ] Response includes database check: "disconnected"
- [ ] Error is logged to `logs/error.log`

**Test Commands**:
```bash
# Stop database (in separate terminal)
docker-compose stop postgres

# Test health check
curl -i http://localhost:3001/health

# Expected: HTTP/1.1 503 Service Unavailable

# Check error log
tail -f backend/logs/error.log | jq

# Restart database
docker-compose start postgres
```

---

#### Test Scenario 6C.8.3: Liveness Probe

**Priority**: High
**Estimated Time**: 1 minute

**Given**: Backend server is running

**When**: Making a GET request to `/health/live`

**Then**:
- [ ] Response status is 200 OK
- [ ] Response includes `status: "alive"`
- [ ] Response includes timestamp
- [ ] Endpoint responds quickly (< 50ms)

**Test Commands**:
```bash
# Test liveness probe
curl http://localhost:3001/health/live | jq

# Expected response:
# {
#   "status": "alive",
#   "timestamp": "2025-11-15T10:30:45.123Z"
# }
```

---

#### Test Scenario 6C.8.4: Readiness Probe - Ready State

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: Backend server is running with database connected

**When**: Making a GET request to `/health/ready`

**Then**:
- [ ] Response status is 200 OK
- [ ] Response includes `status: "ready"`
- [ ] Response includes timestamp

**Test Commands**:
```bash
# Test readiness probe
curl http://localhost:3001/health/ready | jq

# Expected response:
# {
#   "status": "ready",
#   "timestamp": "2025-11-15T10:30:45.123Z"
# }
```

---

#### Test Scenario 6C.8.5: Readiness Probe - Not Ready State

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Backend server is running but database is unavailable

**When**: Making a GET request to `/health/ready`

**Then**:
- [ ] Response status is 503 Service Unavailable
- [ ] Response includes `status: "not ready"`
- [ ] Response includes error message
- [ ] Response includes timestamp

**Test Commands**:
```bash
# Stop database
docker-compose stop postgres

# Test readiness probe
curl -i http://localhost:3001/health/ready | jq

# Expected: HTTP/1.1 503 Service Unavailable
# {
#   "status": "not ready",
#   "error": "Database not accessible",
#   "timestamp": "2025-11-15T10:30:45.123Z"
# }

# Restart database
docker-compose start postgres
```

---

#### Test Scenario 6C.8.6: Request Logging - Automatic Tracking

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: Making various API requests

**Then**:
- [ ] Each request is logged to `logs/combined.log`
- [ ] Log includes method, path, status code, and duration
- [ ] Log format is JSON
- [ ] Log includes timestamp

**Test Commands**:
```bash
# Make some API requests
curl http://localhost:3001/api/products
curl http://localhost:3001/api/categories
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'

# Check combined log
tail -20 backend/logs/combined.log | jq

# Expected log entries:
# {
#   "level": "info",
#   "message": "HTTP Request",
#   "method": "GET",
#   "path": "/api/products",
#   "statusCode": 200,
#   "duration": "45ms",
#   "timestamp": "2025-11-15 10:30:45",
#   "service": "metalpro-backend"
# }
```

---

#### Test Scenario 6C.8.7: Slow Request Detection

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: Backend server is running

**When**: Making a request that takes > 1 second

**Then**:
- [ ] Request is logged as normal
- [ ] Additional warning log is created for slow request
- [ ] Warning log includes "Slow Request" message
- [ ] Warning log includes duration

**Test Commands**:
```bash
# Note: In production, you might need to trigger a slow query
# For testing, check logs during normal operations

# Monitor logs in real-time
tail -f backend/logs/combined.log | jq

# Make requests and look for any slow request warnings
# Any request > 1 second should generate a warning
```

---

#### Test Scenario 6C.8.8: Error Logging

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: Backend server is running

**When**: Triggering an error (e.g., 404, authentication failure)

**Then**:
- [ ] Error details are logged to `logs/error.log`
- [ ] Error log includes error message, stack trace, path, and method
- [ ] Error log format is JSON
- [ ] Normal requests are NOT in error.log

**Test Commands**:
```bash
# Trigger errors
curl http://localhost:3001/nonexistent-route
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"wrong"}'

# Check error log (should only contain error-level logs)
tail -20 backend/logs/error.log | jq

# Verify combined.log has all logs
tail -20 backend/logs/combined.log | jq
```

---

#### Test Scenario 6C.8.9: Log File Structure

**Priority**: Low
**Estimated Time**: 2 minutes

**Given**: Backend server has been running and processing requests

**When**: Checking the `logs/` directory

**Then**:
- [ ] `logs/error.log` exists
- [ ] `logs/combined.log` exists
- [ ] Both files contain JSON-formatted logs
- [ ] Files are in `backend/logs/` directory

**Test Commands**:
```bash
# Check log directory structure
ls -lh backend/logs/

# Expected files:
# error.log
# combined.log

# Verify JSON format
head -5 backend/logs/combined.log | jq
head -5 backend/logs/error.log | jq
```

---

#### Test Scenario 6C.8.10: Development Mode Logging

**Priority**: Low
**Estimated Time**: 2 minutes

**Given**: Backend server is running in development mode (NODE_ENV not set to production)

**When**: Making API requests

**Then**:
- [ ] Logs appear in console (colorized)
- [ ] Logs appear in log files (JSON format)
- [ ] Debug-level logs are visible in development
- [ ] Console output is human-readable

**Test Commands**:
```bash
# Ensure NODE_ENV is not production
echo $NODE_ENV

# Start server and observe console output
npm run dev

# Make a request
curl http://localhost:3001/api/products

# Should see colorized console output AND
# Check log file also has the entry
tail -5 backend/logs/combined.log | jq
```

---

### Phase 6C Summary - Updated Checklist

#### Phase 6C.1: Backend API Setup (4 scenarios)
- [ ] 6C.1.1 - Infrastructure Health Check
- [ ] 6C.1.2 - Database Connection Verification
- [ ] 6C.1.3 - Redis Cache Connection
- [ ] 6C.1.4 - Database Seeding Verification

#### Phase 6C.2: Route Scaffolding (5 scenarios)
- [ ] 6C.2.1 - Products API - List All Products
- [ ] 6C.2.2 - Products API - Get Single Product
- [ ] 6C.2.3 - Categories API - List All Categories
- [ ] 6C.2.4 - Categories API - Get Single Category
- [ ] 6C.2.5 - API Base Info Endpoint

#### Phase 6C.3: Production Authentication System (15 scenarios)
- [ ] 6C.3.1 - User Signup - Business Account
- [ ] 6C.3.2 - User Signup - Individual Account
- [ ] 6C.3.3 - User Signup - Validation Errors
- [ ] 6C.3.4 - User Login - Successful
- [ ] 6C.3.5 - User Login - Failed Authentication
- [ ] 6C.3.6 - Get Current User (Authenticated)
- [ ] 6C.3.7 - Update User Profile
- [ ] 6C.3.8 - Update Company Information
- [ ] 6C.3.9 - Token Refresh
- [ ] 6C.3.10 - User Logout
- [ ] 6C.3.11 - JWT Token Expiration
- [ ] 6C.3.12 - Password Security Verification
- [ ] 6C.3.13 - Session Management
- [ ] 6C.3.14 - CORS Configuration
- [ ] 6C.3.15 - Request Logging

#### Phase 6C.4: File Upload & Storage (16 scenarios)
- [ ] 6C.4.1 - BOM File Upload - Guest User
- [ ] 6C.4.2 - BOM File Upload - Authenticated User
- [ ] 6C.4.3 - BOM File Upload - Excel Format
- [ ] 6C.4.4 - BOM File Upload - File Type Validation
- [ ] 6C.4.5 - BOM File Upload - File Size Validation
- [ ] 6C.4.6 - BOM File Upload - Missing File
- [ ] 6C.4.7 - RFQ Attachment Upload - PDF File
- [ ] 6C.4.8 - RFQ Attachment Upload - Image Files
- [ ] 6C.4.9 - RFQ Attachment Upload - Document Files
- [ ] 6C.4.10 - RFQ Attachment Upload - Missing RFQ ID
- [ ] 6C.4.11 - RFQ Attachment Upload - File Type Validation
- [ ] 6C.4.12 - RFQ Attachment Upload - File Size Validation
- [ ] 6C.4.13 - File Access via Static URL
- [ ] 6C.4.14 - File Organization Structure
- [ ] 6C.4.15 - Multiple File Uploads for Same RFQ
- [ ] 6C.4.16 - Upload Performance Test

#### Phase 6C.5: Email Service Integration - AWS SES (8 scenarios)
- [ ] 6C.5.1 - Email Service - Development Mode
- [ ] 6C.5.2 - RFQ Confirmation Email - Test Endpoint
- [ ] 6C.5.3 - Operator Notification Email - Test Endpoint
- [ ] 6C.5.4 - Email Verification Email - Test Endpoint
- [ ] 6C.5.5 - Password Reset Email - Test Endpoint
- [ ] 6C.5.6 - Quote Ready Email - Test Endpoint
- [ ] 6C.5.7 - All Email Types - Comprehensive Test
- [ ] 6C.5.8 - Email Template - HTML Structure

#### Phase 6C.6: Security Hardening (12 scenarios)
- [ ] 6C.6.1 - Rate Limiting - General API
- [ ] 6C.6.2 - Rate Limiting - Authentication Endpoints (Strict)
- [ ] 6C.6.3 - Rate Limiting - File Upload Endpoints
- [ ] 6C.6.4 - Rate Limiting - RFQ Submission
- [ ] 6C.6.5 - Health Check - Rate Limit Bypass
- [ ] 6C.6.6 - XSS Protection - Script Tag Sanitization
- [ ] 6C.6.7 - MongoDB Injection Protection
- [ ] 6C.6.8 - Environment Variable Validation
- [ ] 6C.6.9 - Error Handling - Production Mode
- [ ] 6C.6.10 - Security Headers - Helmet.js
- [ ] 6C.6.11 - CORS Configuration
- [ ] 6C.6.12 - Input Sanitization - Comprehensive Test

#### Phase 6C.8: Monitoring & Logging (10 scenarios)
- [ ] 6C.8.1 - Health Check - Comprehensive Status
- [ ] 6C.8.2 - Health Check - Degraded State
- [ ] 6C.8.3 - Liveness Probe
- [ ] 6C.8.4 - Readiness Probe - Ready State
- [ ] 6C.8.5 - Readiness Probe - Not Ready State
- [ ] 6C.8.6 - Request Logging - Automatic Tracking
- [ ] 6C.8.7 - Slow Request Detection
- [ ] 6C.8.8 - Error Logging
- [ ] 6C.8.9 - Log File Structure
- [ ] 6C.8.10 - Development Mode Logging

**Total Phase 6C Scenarios**: 70 scenarios (40 + 8 + 12 + 10)

**Last Updated**: November 15, 2025
**Next Review**: Before production release

---

## Phase 10: Back-Office System & RFQ Management

### Test Scenario 10.1: Back-Office Login

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User has back-office operator credentials

**When**: User navigates to http://localhost:8081/backoffice/login

**Then**:
- [ ] Login page displays with MetalPro branding
- [ ] "Back-Office Login" heading is visible
- [ ] Email and password fields are present
- [ ] "Sign In" button is visible
- [ ] User enters valid operator email and password
- [ ] User clicks "Sign In"
- [ ] User is redirected to /backoffice/dashboard
- [ ] No error messages are shown

---

### Test Scenario 10.2: Back-Office Login - Invalid Credentials

**Priority**: High
**Estimated Time**: 2 minutes

**Given**: User is on back-office login page

**When**: User enters invalid credentials

**Then**:
- [ ] User enters non-existent email and password
- [ ] User clicks "Sign In"
- [ ] Error message "Invalid credentials" is displayed
- [ ] User remains on login page
- [ ] Password field is cleared
- [ ] Email field retains entered value

---

### Test Scenario 10.3: Back-Office Dashboard Display

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User is logged into back-office

**When**: User views the dashboard at /backoffice/dashboard

**Then**:
- [ ] Dashboard heading "Dashboard Overview" is visible
- [ ] KPI card "Total RFQs" displays with count
- [ ] KPI card "Pending RFQs" displays with count in orange
- [ ] KPI card "Total Value" displays amount in RON
- [ ] KPI card "Active Products" displays product count
- [ ] "Recent Activity" section displays latest RFQs
- [ ] Each RFQ card shows: company name, reference number, status badge, date
- [ ] Quick action cards are visible for RFQs and Products
- [ ] Sidebar navigation is visible with links to Dashboard, RFQs, Products, Analytics

---

### Test Scenario 10.4: RFQ List View

**Priority**: Critical
**Estimated Time**: 4 minutes

**Given**: User is logged into back-office

**When**: User navigates to /backoffice/rfqs

**Then**:
- [ ] "RFQ Management" heading is displayed
- [ ] Search box "Search by company name..." is visible
- [ ] Status filter dropdown shows "All Statuses" by default
- [ ] RFQ cards are displayed in grid/list format
- [ ] Each RFQ card shows: reference number, company name, contact person, status badge
- [ ] Each RFQ card shows: submission date, estimated total (if available)
- [ ] "View Details" button is present on each card
- [ ] Pagination controls are visible at bottom (if more than 20 RFQs)
- [ ] "Clear Filters" button is visible

---

### Test Scenario 10.5: RFQ Search and Filter

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User is on RFQ list page with multiple RFQs

**When**: User searches and filters RFQs

**Then**:
- [ ] User enters company name in search box
- [ ] Search results filter automatically or on button click
- [ ] Only matching RFQs are displayed
- [ ] User clears search and selects "Submitted" from status filter
- [ ] Only RFQs with "Submitted" status are shown
- [ ] User selects "Quoted" from status filter
- [ ] Only RFQs with "Quoted" status are shown
- [ ] User clicks "Clear Filters"
- [ ] All RFQs are displayed again
- [ ] Search box is cleared and filter is reset to "All Statuses"

---

### Test Scenario 10.6: RFQ Detail View

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: User is on RFQ list page

**When**: User clicks "View Details" on an RFQ

**Then**:
- [ ] User is navigated to /backoffice/rfqs/{id}
- [ ] RFQ detail page displays company name as heading
- [ ] Status badge is displayed next to heading
- [ ] Reference number is shown below heading
- [ ] "Company Information" card displays: company name, CUI, Reg. Com.
- [ ] "Contact Information" card displays: contact person, email, phone
- [ ] Email and phone are clickable links (mailto: and tel:)
- [ ] "Delivery Address" card displays full address (if provided)
- [ ] "Requested Items" table shows all line items
- [ ] Items table includes: SKU, Product name, Quantity, Unit Price, Total
- [ ] "Special Requirements" section displays notes (if any)
- [ ] "Timeline" section shows: Submitted date, Acknowledged date (if set), Quoted date (if set)
- [ ] "Update Status" button is visible
- [ ] "Edit Pricing" button is visible
- [ ] "Back to RFQs" button navigates back to list

---

### Test Scenario 10.7: RFQ Status Update

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: User is viewing RFQ detail page

**When**: User updates RFQ status

**Then**:
- [ ] User clicks "Update Status" button
- [ ] Status update dialog opens
- [ ] Current status is pre-selected in dropdown
- [ ] Status options include: Submitted, Acknowledged, In Progress, Quoted, Completed, Cancelled
- [ ] "Internal Notes" textarea is visible (not visible to customer)
- [ ] "Customer Notes" textarea is visible (visible to customer)
- [ ] User selects "Acknowledged" status
- [ ] User enters internal note: "Customer called for clarification on delivery timeline"
- [ ] User clicks "Update RFQ" button
- [ ] Success toast notification appears: "RFQ status updated successfully"
- [ ] Dialog closes
- [ ] Page refreshes with new status badge showing "Acknowledged"
- [ ] Timeline section now shows "Acknowledged" timestamp
- [ ] Internal notes section displays the entered note

---

### Test Scenario 10.8: RFQ Pricing Editor - Access

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User is viewing RFQ detail page

**When**: User accesses pricing editor

**Then**:
- [ ] User clicks "Edit Pricing" button
- [ ] User is navigated to /backoffice/rfqs/{id}/pricing
- [ ] "Edit Pricing" heading is displayed
- [ ] Company name and reference number shown below heading
- [ ] Info alert displays: "Set the price per unit for each item. Totals will be calculated automatically."
- [ ] "Line Items" table is visible
- [ ] "Cancel" button is visible
- [ ] "Save Pricing" button is visible

---

### Test Scenario 10.9: RFQ Pricing Editor - Set Prices

**Priority**: Critical
**Estimated Time**: 7 minutes

**Given**: User is on pricing editor page

**When**: User sets prices for line items

**Then**:
- [ ] Line items table shows columns: SKU, Product, Quantity, Price per Unit (input), Total
- [ ] Each line item has an input field for "Price per Unit"
- [ ] User enters price for first item (e.g., 5.50 RON)
- [ ] Total for that item calculates automatically (e.g., 5.50 × quantity)
- [ ] User enters prices for all remaining items
- [ ] Subtotal row at bottom calculates sum of all line items
- [ ] "Additional Costs" card is visible
- [ ] User enters "Delivery Cost" (e.g., 150 RON)
- [ ] User enters "Processing Fee" (e.g., 50 RON)
- [ ] VAT Rate field shows default value (19%)
- [ ] "Quote Summary" card displays:
  - Subtotal (items)
  - Delivery Cost (if > 0)
  - Processing Fee (if > 0)
  - VAT (19%)
  - Total Quote (in large bold text with primary color)
- [ ] All calculations update automatically as prices are entered
- [ ] "Mark RFQ as 'Quoted' when saving" checkbox is checked by default

---

### Test Scenario 10.10: RFQ Pricing Editor - Save and Email

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: User has entered all pricing information

**When**: User saves pricing

**Then**:
- [ ] User clicks "Save Pricing" button
- [ ] Loading state is shown on button ("Saving...")
- [ ] Success toast notification appears: "Pricing updated successfully"
- [ ] User is redirected back to RFQ detail page (/backoffice/rfqs/{id})
- [ ] RFQ status badge now shows "Quoted"
- [ ] Items table now displays filled-in unit prices and totals
- [ ] Pricing summary section shows: Subtotal, Delivery Cost, Processing Fee, VAT, Total
- [ ] Total quote amount is prominently displayed
- [ ] Email notification is sent to customer (check console logs in dev mode)
- [ ] Console log shows: "Email sent successfully: Quote Ready to {customer_email}"

---

### Test Scenario 10.11: RFQ Pricing Editor - Validation

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User is on pricing editor page

**When**: User attempts to save without complete pricing

**Then**:
- [ ] User leaves some line items without prices
- [ ] Warning alert is displayed: "Please set prices for all items before saving"
- [ ] User clicks "Save Pricing"
- [ ] Error toast appears: "Please set prices for all items before saving"
- [ ] Form is not submitted
- [ ] User remains on pricing editor page
- [ ] User enters prices for all items
- [ ] Warning alert disappears
- [ ] User can now successfully save

---

### Test Scenario 10.12: Product List View

**Priority**: Critical
**Estimated Time**: 4 minutes

**Given**: User is logged into back-office

**When**: User navigates to /backoffice/products

**Then**:
- [ ] "Product Management" heading is displayed
- [ ] "Manage your product catalog" subtitle is shown
- [ ] "Add Product" button is visible in top-right
- [ ] Search box "Search products..." is present
- [ ] Status filter dropdown shows "All Products" by default
- [ ] "Clear Filters" button is visible
- [ ] Products table displays with columns: Checkbox, SKU, Product, Category, Price, Status, Actions
- [ ] Each product row shows: checkbox, SKU (monospace font), product title, category name, price in RON, status badge (Active/Inactive)
- [ ] "Edit" button with icon is present for each product
- [ ] Pagination controls are visible at bottom (if more than 20 products)
- [ ] Total product count is shown: "Products ({total})"

---

### Test Scenario 10.13: Product Search and Filter

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User is on product list page

**When**: User searches and filters products

**Then**:
- [ ] User enters product name or SKU in search box
- [ ] User clicks search icon or presses Enter
- [ ] Products filter to show only matching results
- [ ] User selects "Active Only" from status filter
- [ ] Only products with isActive=true are displayed
- [ ] User selects "Inactive Only"
- [ ] Only products with isActive=false are displayed
- [ ] User clicks "Clear Filters"
- [ ] All products are displayed again
- [ ] Search box is cleared and filter reset

---

### Test Scenario 10.14: Product Bulk Selection and Actions

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User is on product list page with multiple products

**When**: User selects multiple products

**Then**:
- [ ] User clicks checkbox on first product row
- [ ] Row is highlighted with selected state
- [ ] Bulk actions bar appears at top: "{count} products selected"
- [ ] Bulk action buttons are visible: Activate, Deactivate, Delete
- [ ] User clicks checkbox on second product row
- [ ] Bulk actions bar updates: "2 products selected"
- [ ] User clicks "Select All" checkbox in table header
- [ ] All visible products are selected
- [ ] Bulk actions bar shows total count selected
- [ ] User clicks "Select All" again
- [ ] All products are deselected
- [ ] Bulk actions bar disappears

---

### Test Scenario 10.15: Product Bulk Activate/Deactivate

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User has selected multiple inactive products

**When**: User performs bulk activate action

**Then**:
- [ ] User selects 2-3 inactive products (with "Inactive" badge)
- [ ] Bulk actions bar displays
- [ ] User clicks "Activate" button
- [ ] Loading state is shown
- [ ] Success toast appears: "{count} products activated"
- [ ] Product list refreshes
- [ ] Previously selected products now show "Active" badge
- [ ] Selection is cleared and bulk actions bar disappears
- [ ] User selects 2-3 active products
- [ ] User clicks "Deactivate" button
- [ ] Success toast appears: "{count} products deactivated"
- [ ] Selected products now show "Inactive" badge

---

### Test Scenario 10.16: Product Bulk Delete

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User has selected multiple products

**When**: User performs bulk delete action

**Then**:
- [ ] User selects 2-3 products
- [ ] User clicks "Delete" button in bulk actions bar
- [ ] Delete confirmation dialog opens
- [ ] Dialog title: "Delete Products"
- [ ] Dialog shows: "Are you sure you want to delete {count} products? This action cannot be undone."
- [ ] "Cancel" and "Delete" buttons are visible
- [ ] User clicks "Cancel"
- [ ] Dialog closes, products remain selected
- [ ] User clicks "Delete" again
- [ ] User clicks "Delete" in dialog
- [ ] Loading state is shown
- [ ] Success toast appears: "{count} products deleted"
- [ ] Product list refreshes
- [ ] Deleted products are no longer visible
- [ ] Selection is cleared

---

### Test Scenario 10.17: Create New Product

**Priority**: Critical
**Estimated Time**: 7 minutes

**Given**: User is on product list page

**When**: User creates a new product

**Then**:
- [ ] User clicks "Add Product" button
- [ ] User is navigated to /backoffice/products/new
- [ ] "New Product" heading is displayed
- [ ] Form displays with sections: Basic Information, Pricing & Units, Physical Properties, Status
- [ ] "Cancel" and "Save Product" buttons are visible
- [ ] User enters SKU: "PROD-TEST-001"
- [ ] User enters Category ID (valid UUID)
- [ ] User enters Product Title: "Test Product"
- [ ] User enters Grade: "S235JR" (optional)
- [ ] User enters Standard: "EN 10025" (optional)
- [ ] User enters Dimensions: "100x50x5" (optional)
- [ ] User enters Price per Unit: 12.50
- [ ] User selects Base Unit: "kg"
- [ ] User selects Availability: "In Stock"
- [ ] User enters Weight: 15.5 kg (optional)
- [ ] User enters Length: 6.0 m (optional)
- [ ] "Product is active" checkbox is checked by default
- [ ] User clicks "Save Product"
- [ ] Success toast appears: "Product created successfully"
- [ ] User is redirected to /backoffice/products
- [ ] New product appears in the list

---

### Test Scenario 10.18: Create Product - Validation

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User is on create product page

**When**: User attempts to save without required fields

**Then**:
- [ ] User leaves SKU field empty
- [ ] User clicks "Save Product"
- [ ] Error toast appears: "Please fill in all required fields"
- [ ] Form is not submitted
- [ ] User enters SKU but leaves Category ID empty
- [ ] Error occurs again
- [ ] User enters all required fields but sets Price to 0
- [ ] User clicks "Save Product"
- [ ] Error toast: "Price per unit must be greater than 0"
- [ ] User enters valid price (e.g., 10.00)
- [ ] User can now save successfully

---

### Test Scenario 10.19: Edit Existing Product

**Priority**: Critical
**Estimated Time**: 6 minutes

**Given**: User is on product list page

**When**: User edits an existing product

**Then**:
- [ ] User clicks "Edit" button on a product row
- [ ] User is navigated to /backoffice/products/{id}/edit
- [ ] "Edit Product" heading is displayed
- [ ] Form is pre-filled with existing product data
- [ ] All fields display current values
- [ ] "Delete" button is visible in top-right (red/destructive style)
- [ ] User modifies Product Title
- [ ] User changes Price per Unit
- [ ] User unchecks "Product is active" checkbox
- [ ] User clicks "Save Product"
- [ ] Success toast: "Product updated successfully"
- [ ] User is redirected to /backoffice/products
- [ ] Updated product shows new title, price, and "Inactive" status

---

### Test Scenario 10.20: Delete Single Product

**Priority**: High
**Estimated Time**: 4 minutes

**Given**: User is editing a product

**When**: User deletes the product

**Then**:
- [ ] User is on product edit page (/backoffice/products/{id}/edit)
- [ ] User clicks "Delete" button
- [ ] Delete confirmation dialog opens
- [ ] Dialog title: "Delete Product"
- [ ] Dialog message: "Are you sure you want to delete this product? This action cannot be undone."
- [ ] "Cancel" and "Delete" buttons are visible
- [ ] User clicks "Cancel"
- [ ] Dialog closes, user remains on edit page
- [ ] User clicks "Delete" again
- [ ] User clicks "Delete" in dialog
- [ ] Success toast: "Product deleted successfully"
- [ ] User is redirected to /backoffice/products
- [ ] Deleted product is no longer in the list

---

### Test Scenario 10.21: Analytics Dashboard Display

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User is logged into back-office

**When**: User navigates to /backoffice/analytics

**Then**:
- [ ] "Analytics & Reports" heading is displayed
- [ ] "Business insights and performance metrics" subtitle is shown
- [ ] Date range filter is visible in top-right (default: "Last 30 days")
- [ ] Four KPI cards are displayed:
  - Total RFQs (with "All time" label)
  - Pending RFQs (with orange color)
  - Total Value (in thousands RON, green color)
  - Avg. Response Time (in hours, blue color)
- [ ] Each KPI card has appropriate icon
- [ ] KPI values are displayed prominently

---

### Test Scenario 10.22: Analytics Charts Display

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User is on analytics dashboard

**When**: User views charts section

**Then**:
- [ ] "RFQ Status Distribution" pie chart is visible
- [ ] Pie chart shows segments for: Submitted, In Progress, Quoted, Completed, Cancelled
- [ ] Each segment has different color
- [ ] Percentages are displayed on chart
- [ ] "RFQ Volume Trend" line chart is visible
- [ ] Line chart shows RFQ count over time (last 30 days)
- [ ] X-axis shows dates, Y-axis shows count
- [ ] "Revenue Trend" bar chart is visible
- [ ] Bar chart shows revenue in RON over time
- [ ] Tooltip appears on hover showing exact values
- [ ] All charts are responsive and render properly

---

### Test Scenario 10.23: Analytics Recent Activity

**Priority**: Medium
**Estimated Time**: 4 minutes

**Given**: User is on analytics dashboard

**When**: User views recent activity section

**Then**:
- [ ] "Recent RFQ Activity" section is visible
- [ ] Table displays latest 10 RFQs
- [ ] Columns: Reference, Company, Status, Value, Submitted, Actions
- [ ] Each row shows: reference number (monospace), company name, status badge, value in RON (or "-"), submission date
- [ ] "View" button is present for each RFQ
- [ ] User clicks "View" button
- [ ] User is navigated to RFQ detail page (/backoffice/rfqs/{id})
- [ ] Back button returns to analytics page

---

### Test Scenario 10.24: Analytics Performance Insights

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: User is on analytics dashboard

**When**: User views performance insights section

**Then**:
- [ ] Three insight cards are displayed:
  - Conversion Rate (blue background)
  - Avg. Quote Value (green background)
  - Active Customers (purple background)
- [ ] Conversion Rate shows percentage with description "RFQs converted to quotes"
- [ ] Avg. Quote Value shows amount in thousands RON with "Average per RFQ"
- [ ] Active Customers shows count with "Unique companies"
- [ ] All values are calculated correctly based on RFQ data

---

### Test Scenario 10.25: Analytics Date Range Filter

**Priority**: Medium
**Estimated Time**: 4 minutes

**Given**: User is on analytics dashboard

**When**: User changes date range

**Then**:
- [ ] User clicks date range dropdown (shows "Last 30 days")
- [ ] Options are displayed: Last 7 days, Last 30 days, Last 90 days, Last year
- [ ] User selects "Last 7 days"
- [ ] Page refreshes with loading state
- [ ] All KPIs update to show data for last 7 days
- [ ] Charts update to reflect new date range
- [ ] Recent activity updates (if different results)
- [ ] User selects "Last year"
- [ ] Data updates to show annual statistics
- [ ] Charts show longer time periods

---

### Test Scenario 10.26: Back-Office Navigation

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User is logged into back-office

**When**: User navigates between sections

**Then**:
- [ ] Sidebar is visible on all back-office pages
- [ ] Sidebar contains links: Dashboard, RFQs, Products, Analytics
- [ ] Each link has an icon
- [ ] Active page link is highlighted
- [ ] User clicks "Dashboard"
- [ ] User is navigated to /backoffice/dashboard
- [ ] Dashboard link is highlighted
- [ ] User clicks "RFQs"
- [ ] User is navigated to /backoffice/rfqs
- [ ] RFQs link is highlighted
- [ ] User clicks "Products"
- [ ] User is navigated to /backoffice/products
- [ ] User clicks "Analytics"
- [ ] User is navigated to /backoffice/analytics
- [ ] Navigation is smooth without page reload delays

---

### Test Scenario 10.27: Back-Office Logout

**Priority**: Critical
**Estimated Time**: 3 minutes

**Given**: User is logged into back-office

**When**: User logs out

**Then**:
- [ ] User profile dropdown is visible in sidebar or header
- [ ] User clicks profile dropdown
- [ ] "Logout" option is displayed
- [ ] User clicks "Logout"
- [ ] User is logged out
- [ ] User is redirected to /backoffice/login
- [ ] Subsequent attempt to access /backoffice/dashboard without login redirects to login page
- [ ] Previous session is terminated

---

### Test Scenario 10.28: Back-Office Protected Routes

**Priority**: Critical
**Estimated Time**: 4 minutes

**Given**: User is not logged into back-office

**When**: User attempts to access protected routes

**Then**:
- [ ] User navigates to /backoffice/dashboard
- [ ] User is automatically redirected to /backoffice/login
- [ ] User navigates to /backoffice/rfqs
- [ ] User is redirected to login
- [ ] User navigates to /backoffice/products
- [ ] User is redirected to login
- [ ] User logs in with valid credentials
- [ ] User is redirected to originally requested page (or dashboard)
- [ ] User can now access all back-office pages

---

### Test Scenario 10.29: Email Notification - RFQ Acknowledgment

**Priority**: High
**Estimated Time**: 5 minutes

**Prerequisites**: Email service configured (or development mode active)

**Given**: Operator is viewing an RFQ with status "Submitted"

**When**: Operator acknowledges the RFQ

**Then**:
- [ ] Operator clicks "Update Status"
- [ ] Operator selects "Acknowledged" status
- [ ] Operator clicks "Update RFQ"
- [ ] Status updates successfully
- [ ] In development mode, console log shows: "[EMAIL - RFQ Acknowledgment] Would send email via SES"
- [ ] Console displays email details: To, From, Subject
- [ ] Email subject: "RFQ {reference} în Lucru - MetalPro"
- [ ] In production mode with AWS SES: email is sent to customer
- [ ] Customer receives acknowledgment email with:
  - Status update
  - Estimated processing time
  - Link to order tracking

---

### Test Scenario 10.30: Email Notification - Quote Ready

**Priority**: High
**Estimated Time**: 5 minutes

**Prerequisites**: Email service configured (or development mode active)

**Given**: Operator has set pricing for an RFQ

**When**: Operator marks RFQ as "Quoted"

**Then**:
- [ ] Operator is on pricing editor page with all prices set
- [ ] "Mark RFQ as 'Quoted' when saving" checkbox is checked
- [ ] Operator clicks "Save Pricing"
- [ ] Pricing saves successfully
- [ ] RFQ status changes to "Quoted"
- [ ] In development mode, console log shows: "[EMAIL - Quote Ready] Would send email via SES"
- [ ] Console displays email details including quote amount
- [ ] Email subject: "Ofertă Pregătită - {reference}"
- [ ] In production: customer receives quote ready email with:
  - Total quote amount prominently displayed
  - Link to download quote PDF (placeholder)
  - Contact information

---

### Test Scenario 10.31: Back-Office Responsive Design - Mobile

**Priority**: Medium
**Estimated Time**: 6 minutes

**Given**: User is logged into back-office on mobile device (or browser DevTools mobile mode)

**When**: User views back-office pages on mobile

**Then**:
- [ ] Sidebar collapses to hamburger menu on mobile
- [ ] Dashboard displays KPI cards stacked vertically
- [ ] RFQ list cards stack vertically with full width
- [ ] RFQ detail page sections stack vertically
- [ ] Pricing editor table scrolls horizontally on small screens
- [ ] Product list table scrolls horizontally
- [ ] Analytics charts resize responsively
- [ ] All buttons and inputs are appropriately sized for touch
- [ ] No horizontal scrolling on pages (except tables)
- [ ] Text is readable without zooming

---

### Test Scenario 10.32: Back-Office Loading States

**Priority**: Medium
**Estimated Time**: 4 minutes

**Given**: User is performing actions in back-office

**When**: Data is being loaded or saved

**Then**:
- [ ] On initial page load, loading spinner is displayed
- [ ] Spinner is centered with appropriate size
- [ ] When saving RFQ status, button shows "Updating..." text
- [ ] When saving pricing, button shows "Saving..." text
- [ ] When creating product, button shows "Saving..." text
- [ ] Buttons are disabled during loading
- [ ] Multiple clicks are prevented during save
- [ ] Loading states clear when operation completes
- [ ] On error, loading state is removed and error is shown

---

### Test Scenario 10.33: Back-Office Error Handling

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: User is performing actions that may fail

**When**: An error occurs

**Then**:
- [ ] User attempts to load RFQ with invalid ID
- [ ] Error page or message is displayed: "RFQ not found"
- [ ] "Back to RFQs" button is available
- [ ] User attempts to save pricing without network
- [ ] Error toast appears with descriptive message
- [ ] Form data is not lost
- [ ] User can retry after fixing issue
- [ ] User attempts to create product with duplicate SKU
- [ ] Validation error is shown
- [ ] All error messages are user-friendly and in Romanian

---

### Test Scenario 10.34: Back-Office Toast Notifications

**Priority**: Medium
**Estimated Time**: 4 minutes

**Given**: User is performing various actions

**When**: Actions complete successfully or fail

**Then**:
- [ ] Success toast appears on RFQ status update (green checkmark)
- [ ] Success toast appears on pricing save (green checkmark)
- [ ] Success toast appears on product create/update (green checkmark)
- [ ] Success toast appears on product delete (green checkmark)
- [ ] Error toast appears on validation failure (red X)
- [ ] Error toast appears on network error (red X)
- [ ] Toasts auto-dismiss after 3-5 seconds
- [ ] Multiple toasts stack vertically
- [ ] Toasts are positioned consistently (top-right or bottom-right)
- [ ] Toast messages are clear and actionable

---

### Test Scenario 10.35: Back-Office Data Consistency

**Priority**: High
**Estimated Time**: 6 minutes

**Given**: Multiple operators are working on same data

**When**: Data is updated by one operator

**Then**:
- [ ] Operator A views RFQ detail page
- [ ] Operator B updates the same RFQ status
- [ ] Operator A refreshes page
- [ ] Page displays updated status from Operator B
- [ ] Operator A sets pricing for RFQ
- [ ] Operator B views same RFQ
- [ ] Operator B sees updated pricing
- [ ] Product list shows consistent data across all operators
- [ ] Analytics dashboard reflects latest RFQ/product data
- [ ] No stale data is displayed

---

## Phase 10 Test Summary

**Total Test Scenarios**: 35 scenarios

### By Priority:
- **Critical**: 15 scenarios (Login, Dashboard, RFQ Management, Pricing, Product CRUD, Protected Routes)
- **High**: 13 scenarios (Filters, Validation, Bulk Operations, Email Notifications, Error Handling)
- **Medium**: 7 scenarios (Analytics, Responsive Design, Loading States, Notifications)

### By Feature Area:
- **Authentication & Authorization**: 3 scenarios (10.1, 10.2, 10.28)
- **Dashboard**: 1 scenario (10.3)
- **RFQ Management**: 10 scenarios (10.4 - 10.11, 10.29, 10.30)
- **Product Management**: 10 scenarios (10.12 - 10.20)
- **Analytics**: 5 scenarios (10.21 - 10.25)
- **Navigation & UX**: 6 scenarios (10.26, 10.27, 10.31 - 10.34)
- **Data Quality**: 1 scenario (10.35)

### Test Coverage:
- [x] Back-office authentication and authorization
- [x] RFQ listing, filtering, and search
- [x] RFQ detail view and status updates
- [x] RFQ pricing editor with calculations
- [x] Product CRUD operations
- [x] Product bulk operations (activate, deactivate, delete)
- [x] Product search and filtering
- [x] Analytics dashboard with charts
- [x] Email notifications (acknowledgment and quote ready)
- [x] Navigation and routing
- [x] Responsive design (mobile/desktop)
- [x] Loading and error states
- [x] Toast notifications
- [x] Data consistency

**Estimated Total Testing Time**: ~2.5 hours

**Last Updated**: November 25, 2025
**Next Review**: Before production release

---

## Phase 11: Email Service (Zoho SMTP)

### Overview

This phase covers manual testing of the transactional email service powered by Zoho Mail SMTP. The system sends two types of emails:
1. **RFQ Submitted Email** - Sent to customer when they submit an RFQ
2. **RFQ Quoted Email** - Sent to customer when backoffice changes RFQ status to "Quoted"

**Email Service Configuration:**
- SMTP Host: smtp.zoho.eu
- SMTP Port: 465 (SSL)
- From Address: no-reply@metal-direct.ro

---

### Test Scenario 11.1: RFQ Submitted Email - Development Mode

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: 
- Backend is running in development mode (no ZOHO_MAIL_PASSWORD set)
- User is on the RFQ submission page with items in cart

**When**: User completes and submits an RFQ

**Then**:
- [ ] Backend logs show email details to console:
  ```
  ===========================================
  📧 [EMAIL - RFQ Submitted]
  To: customer@email.com
  From: no-reply@metal-direct.ro
  Subject: Confirmare cerere ofertă RFQ-2025-XXXX - Metal Direct
  ===========================================
  ```
- [ ] RFQ is created successfully in database
- [ ] User sees success confirmation page
- [ ] No actual email is sent (development mode)

---

### Test Scenario 11.2: RFQ Submitted Email - Production Mode

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: 
- Backend is running with ZOHO_MAIL_PASSWORD configured
- User is on the RFQ submission page with items in cart

**When**: User completes and submits an RFQ

**Then**:
- [ ] Backend logs show: `✅ Email sent: RFQ Submitted to customer@email.com (ID: xxx)`
- [ ] Customer receives email at provided address
- [ ] Email contains:
  - [ ] Subject: "Confirmare cerere ofertă RFQ-2025-XXXX - Metal Direct"
  - [ ] Greeting with customer's contact person name
  - [ ] RFQ reference number
  - [ ] Table with products (columns: Produs, Cantitate, Preț estimat)
  - [ ] Total estimated amount
  - [ ] Metal Direct branding (blue header #1e40af)
- [ ] Product names display correctly (not "Product UUID")
- [ ] Quantities and prices are formatted correctly

---

### Test Scenario 11.3: RFQ Quoted Email - Development Mode

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: 
- Backend is running in development mode
- An RFQ exists with status "SUBMITTED"
- Operator is logged into backoffice

**When**: Operator changes RFQ status to "QUOTED"

**Then**:
- [ ] Backend logs show email details to console:
  ```
  ===========================================
  📧 [EMAIL - RFQ Quoted]
  To: customer@email.com
  From: no-reply@metal-direct.ro
  Subject: Oferta RFQ-2025-XXXX este gata - Metal Direct
  ===========================================
  ```
- [ ] RFQ status is updated to QUOTED in database
- [ ] quotedAt timestamp is set
- [ ] No actual email is sent (development mode)

---

### Test Scenario 11.4: RFQ Quoted Email - Production Mode

**Priority**: Critical
**Estimated Time**: 5 minutes

**Given**: 
- Backend is running with ZOHO_MAIL_PASSWORD configured
- An RFQ exists with status "SUBMITTED" and pricing set
- Operator is logged into backoffice

**When**: Operator changes RFQ status to "QUOTED"

**Then**:
- [ ] Backend logs show: `✅ Email sent: RFQ Quoted to customer@email.com (ID: xxx)`
- [ ] Customer receives email at provided address
- [ ] Email contains:
  - [ ] Subject: "Oferta RFQ-2025-XXXX este gata - Metal Direct"
  - [ ] Greeting with customer's contact person name
  - [ ] RFQ reference number
  - [ ] Table with products (columns: Produs, Cantitate, Preț final)
  - [ ] Final total amount
  - [ ] Metal Direct branding (green header #166534)
  - [ ] Call-to-action to contact for order confirmation
- [ ] Final prices (if set) are displayed, otherwise gross prices

---

### Test Scenario 11.5: Email Not Sent on Non-QUOTED Status Change

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: 
- An RFQ exists with status "SUBMITTED"
- Operator is logged into backoffice

**When**: Operator changes RFQ status to "ACKNOWLEDGED" or "IN_PROGRESS"

**Then**:
- [ ] RFQ status is updated successfully
- [ ] NO email is sent to customer
- [ ] No email-related logs appear in console

---

### Test Scenario 11.6: Email Not Sent on Repeated QUOTED Status

**Priority**: High
**Estimated Time**: 3 minutes

**Given**: 
- An RFQ exists with status already "QUOTED"
- Operator is logged into backoffice

**When**: Operator saves the RFQ without changing status (or changes other fields)

**Then**:
- [ ] RFQ is updated successfully
- [ ] NO duplicate email is sent to customer
- [ ] Email is only sent on first transition to QUOTED

---

### Test Scenario 11.7: Email Service Initialization Check

**Priority**: Medium
**Estimated Time**: 2 minutes

**Given**: Backend server is starting up

**When**: Server initialization completes

**Then** (Development Mode - no password):
- [ ] Logs show: `📧 Email service running in DEVELOPMENT mode (no Zoho credentials)`
- [ ] Logs show: `📧 Emails will be logged to console instead of being sent`

**Then** (Production Mode - password set):
- [ ] Logs show: `📧 Email service initialized with Zoho SMTP (smtp.zoho.eu)`

---

### Test Scenario 11.8: Email Failure Handling

**Priority**: High
**Estimated Time**: 5 minutes

**Given**: 
- Backend is running with invalid ZOHO_MAIL_PASSWORD
- User submits an RFQ

**When**: Email sending fails

**Then**:
- [ ] RFQ is still created successfully (email failure doesn't block RFQ creation)
- [ ] Error is logged: `❌ Error sending email (RFQ Submitted): ...`
- [ ] User still sees success confirmation
- [ ] No crash or unhandled exception

---

### Test Scenario 11.9: Email Content - Romanian Characters

**Priority**: Medium
**Estimated Time**: 3 minutes

**Given**: 
- Backend is running in production mode
- Product names contain Romanian characters (ă, â, î, ș, ț)

**When**: RFQ is submitted with products having Romanian names

**Then**:
- [ ] Email displays Romanian characters correctly
- [ ] No encoding issues (no mojibake like Ã¢ or â€)
- [ ] Product name example: "Țeavă rectangulară 100x60x3mm" displays correctly

---

### Test Scenario 11.10: Email Test Endpoints (Development Only)

**Priority**: Low
**Estimated Time**: 5 minutes

**Given**: 
- Backend is running
- Test endpoints are available at /api/email-test/*

**When**: POST request to /api/email-test/rfq-submitted with body:
```json
{ "email": "test@example.com" }
```

**Then**:
- [ ] Response: `{ "success": true, "message": "Email RFQ Submitted sent (or logged to console)" }`
- [ ] Email is sent/logged to specified address

**When**: POST request to /api/email-test/rfq-quoted with body:
```json
{ "email": "test@example.com" }
```

**Then**:
- [ ] Response: `{ "success": true, "message": "Email RFQ Quoted sent (or logged to console)" }`
- [ ] Email is sent/logged to specified address

---

## Phase 11 Test Summary

**Total Test Scenarios**: 10 scenarios

### By Priority:
- **Critical**: 4 scenarios (11.1-11.4 - Core email sending functionality)
- **High**: 3 scenarios (11.5, 11.6, 11.8 - Edge cases and error handling)
- **Medium**: 2 scenarios (11.7, 11.9 - Initialization and encoding)
- **Low**: 1 scenario (11.10 - Test endpoints)

### By Feature Area:
- **RFQ Submitted Email**: 2 scenarios (11.1, 11.2)
- **RFQ Quoted Email**: 2 scenarios (11.3, 11.4)
- **Email Logic**: 2 scenarios (11.5, 11.6)
- **Error Handling**: 1 scenario (11.8)
- **Service Configuration**: 1 scenario (11.7)
- **Content Quality**: 1 scenario (11.9)
- **Test Utilities**: 1 scenario (11.10)

### Test Coverage:
- [x] Email sending in development mode (console logging)
- [x] Email sending in production mode (actual delivery)
- [x] RFQ Submitted email content and formatting
- [x] RFQ Quoted email content and formatting
- [x] Email trigger conditions (only on QUOTED transition)
- [x] Email service initialization
- [x] Error handling and graceful degradation
- [x] Romanian character encoding
- [x] Test endpoints for manual verification

### Environment Requirements:
- **Development Testing**: No special config needed (emails logged to console)
- **Production Testing**: Requires ZOHO_MAIL_PASSWORD in environment

**Estimated Total Testing Time**: ~40 minutes

**Last Updated**: December 22, 2025

---
