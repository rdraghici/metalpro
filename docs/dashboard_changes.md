# Backoffice Dashboard Changes

## Overview
Required changes to the Backoffice Dashboard page (http://localhost:8080/backoffice/dashboard)

## Changes List

### 1. Total RFQs Badge - Add Click Navigation
**Status:** Pending
**Description:** Make the Total RFQs card clickable
**Action:** Navigate to `/backoffice/rfqs?page=1` when clicked
**Current:** Card is not clickable
**File:** `src/pages/BackofficeDashboard.tsx`

---

### 2. Pending RFQs Badge - Already Working
**Status:** Complete
**Description:** Pending RFQs badge is already clickable and working correctly
**Current:** Navigates to `/backoffice/rfqs?page=1&status=SUBMITTED`

---

### 3. Quoted RFQs Badge - Add Click Navigation
**Status:** Pending
**Description:** Make the Quoted card clickable
**Action:** Navigate to `/backoffice/rfqs?page=1&status=QUOTED` when clicked
**Current:** Card is not clickable
**File:** `src/pages/BackofficeDashboard.tsx`

---

### 4. Completed RFQs Badge - Add Click Navigation
**Status:** Pending
**Description:** Make the Completed card clickable
**Action:** Navigate to `/backoffice/rfqs?page=1&status=COMPLETED` when clicked
**Current:** Card is not clickable
**File:** `src/pages/BackofficeDashboard.tsx`

---

### 5. Quoted RFQs Badge - Fix Count Display
**Status:** Pending
**Description:** Badge always shows 0 even when there are quoted RFQs
**Action:** Fix the data fetching/calculation logic for quoted RFQs count
**Current:** Always displays 0
**Expected:** Should display actual count of RFQs with status QUOTED
**Files:**
- `src/pages/BackofficeDashboard.tsx`
- `src/lib/api/backoffice.ts` or backend endpoint

---

### 6. Completed RFQs Badge - Fix Count Display
**Status:** Pending
**Description:** Badge always shows 0 even when there are completed RFQs
**Action:** Fix the data fetching/calculation logic for completed RFQs count
**Current:** Always displays 0
**Expected:** Should display actual count of RFQs with status COMPLETED
**Files:**
- `src/pages/BackofficeDashboard.tsx`
- `src/lib/api/backoffice.ts` or backend endpoint

---

### 7. Conversion Rate Badge - Remove
**Status:** Pending
**Description:** Remove the Conversion Rate card entirely as it's not being used
**Action:** Delete the Conversion Rate card component from the dashboard
**Current:** Displays "0%" conversion rate
**File:** `src/pages/BackofficeDashboard.tsx`

---

### 8. Average Response Time Badge - Fix Calculation
**Status:** Pending
**Description:** Badge always shows 0h, should calculate actual response time
**Action:** Calculate average time between `submittedAt` and `quotedAt` timestamps
**Calculation Logic:**
- For each RFQ with both `submittedAt` and `quotedAt` timestamps
- Calculate difference in hours: `(quotedAt - submittedAt) / (1000 * 60 * 60)`
- Average all results and round to nearest hour
**Current:** Always displays "0h"
**Expected:** Display actual average in hours (e.g., "24h", "48h")
**Files:**
- `src/pages/BackofficeDashboard.tsx`
- Backend endpoint `/api/backoffice/analytics/kpis` in `backend/src/routes/backoffice.routes.ts`

---

### 9. Total Value Badge - Fix Calculation
**Status:** Pending
**Description:** Total value should exclude cancelled RFQs
**Action:** Calculate total value of ALL RFQs excluding those with status CANCELLED
**Calculation Logic:**
- Sum of `estimatedTotal` or `finalQuoteAmount` for all RFQs
- WHERE status != 'CANCELLED'
**Expected:** Display total value of all non-cancelled RFQs
**Files:**
- `src/pages/BackofficeDashboard.tsx`
- Backend endpoint `/api/backoffice/analytics/kpis` in `backend/src/routes/backoffice.routes.ts`

---

### 10. Remove Duplicate Pending RFQs Badge
**Status:** Pending
**Description:** Remove the duplicate Pending RFQs badge from the dashboard
**Action:** Identify and remove the duplicate badge element
**Current:** Two Pending RFQs badges displayed
**Expected:** Only one Pending RFQs badge should be visible
**File:** `src/pages/BackofficeDashboard.tsx`

---

### 11. Remove Analytics Badge
**Status:** Pending
**Description:** Remove the Analytics badge from the dashboard
**Action:** Delete the Analytics card component
**Current:** Analytics badge is displayed but not needed
**File:** `src/pages/BackofficeDashboard.tsx`

---

### 12. Remove Products Badge
**Status:** Pending
**Description:** Remove the Products badge from the dashboard
**Action:** Delete the Products card component
**Current:** Products badge is displayed but not needed
**File:** `src/pages/BackofficeDashboard.tsx`

---

### 13. Move RFQ Volume Trend Graph to Dashboard
**Status:** Pending
**Description:** Move RFQ Volume Trend graph from Analytics page to Dashboard and make it functional with real weekly data
**Action:**
- Move graph component from Analytics page to Dashboard
- Implement backend endpoint to provide weekly RFQ volume data
- Connect graph to real data instead of mock data
**Data Requirements:**
- Group RFQs by week
- Count submissions per week
- Return data for display in chart format
**Files:**
- `src/pages/BackofficeDashboard.tsx`
- `src/pages/BackofficeAnalytics.tsx` (remove from here)
- Backend endpoint for weekly RFQ volume data

---

### 14. Move Revenue Trend Graph to Dashboard
**Status:** Pending
**Description:** Move Revenue Trend graph from Analytics page to Dashboard and make it functional with real weekly data
**Action:**
- Move graph component from Analytics page to Dashboard
- Implement backend endpoint to provide weekly revenue data
- Connect graph to real data instead of mock data
**Data Requirements:**
- Group RFQs by week
- Sum revenue (finalQuoteAmount or estimatedTotal) per week
- Exclude cancelled RFQs
- Return data for display in chart format
**Files:**
- `src/pages/BackofficeDashboard.tsx`
- `src/pages/BackofficeAnalytics.tsx` (remove from here)
- Backend endpoint for weekly revenue data

---

### 15. Move Recent RFQ Activity to Dashboard
**Status:** Pending
**Description:** Move Recent RFQ Activity section from Analytics page to Dashboard
**Action:**
- Move Recent RFQ Activity component from Analytics page to Dashboard
- Ensure it displays correctly with existing functionality
**Files:**
- `src/pages/BackofficeDashboard.tsx`
- `src/pages/BackofficeAnalytics.tsx` (remove from here)

---

### 16. Remove Analytics Page from UI
**Status:** Pending
**Description:** Completely remove the Analytics page from the application UI
**Action:**
- Remove Analytics route from routing configuration
- Remove Analytics navigation link from sidebar/menu
- Delete or disable Analytics page component
**Current:** Analytics page is accessible via navigation
**Expected:** Analytics page should not be accessible or visible in navigation
**Files:**
- `src/App.tsx` or routing configuration file
- Sidebar/navigation component
- `src/pages/BackofficeAnalytics.tsx` (may be deleted or archived)

---

## Implementation Priority

### High Priority (Functional Issues)
1. Change #5: Fix Quoted RFQs count
2. Change #6: Fix Completed RFQs count
3. Change #8: Fix Average Response Time calculation
4. Change #9: Fix Total Value calculation
5. Change #13: Move RFQ Volume Trend to Dashboard with real data
6. Change #14: Move Revenue Trend to Dashboard with real data

### Medium Priority (UX Improvements)
1. Change #1: Make Total RFQs clickable
2. Change #3: Make Quoted RFQs clickable
3. Change #4: Make Completed RFQs clickable
4. Change #15: Move Recent RFQ Activity to Dashboard

### Low Priority (Cleanup)
1. Change #7: Remove Conversion Rate badge
2. Change #10: Remove duplicate Pending RFQs badge
3. Change #11: Remove Analytics badge
4. Change #12: Remove Products badge
5. Change #16: Remove Analytics page from UI

---

## Technical Notes

### Backend Changes Required
The backend endpoint `/api/backoffice/analytics/kpis` likely needs updates to:
- Return correct counts for quoted and completed RFQs
- Calculate average response time correctly
- Exclude cancelled RFQs from total value calculation

### Frontend Changes Required
The frontend `BackofficeDashboard.tsx` needs updates to:
- Add click handlers and navigation for badge cards
- Remove the Conversion Rate card
- Display correct values from backend

### Testing Checklist

#### KPI Badges
- [ ] Total RFQs badge navigates correctly to `/backoffice/rfqs?page=1`
- [ ] Quoted RFQs badge shows correct count
- [ ] Quoted RFQs badge navigates to `/backoffice/rfqs?page=1&status=QUOTED`
- [ ] Completed RFQs badge shows correct count
- [ ] Completed RFQs badge navigates to `/backoffice/rfqs?page=1&status=COMPLETED`
- [ ] Average Response Time shows correct hours (not 0h)
- [ ] Total Value excludes cancelled RFQs
- [ ] All remaining badges have proper hover states
- [ ] Navigation preserves correct query parameters

#### Removed Elements
- [ ] Conversion Rate badge is removed
- [ ] Duplicate Pending RFQs badge is removed
- [ ] Analytics badge is removed
- [ ] Products badge is removed

#### New Dashboard Components
- [ ] RFQ Volume Trend graph displays on Dashboard
- [ ] RFQ Volume Trend shows real weekly data
- [ ] RFQ Volume Trend is NOT on Analytics page
- [ ] Revenue Trend graph displays on Dashboard
- [ ] Revenue Trend shows real weekly data (excluding cancelled RFQs)
- [ ] Revenue Trend is NOT on Analytics page
- [ ] Recent RFQ Activity displays on Dashboard
- [ ] Recent RFQ Activity is NOT on Analytics page

#### Navigation & Routing
- [ ] Analytics page is removed from navigation menu
- [ ] Analytics page route does not work (404 or redirect)
- [ ] All Dashboard components load without errors
