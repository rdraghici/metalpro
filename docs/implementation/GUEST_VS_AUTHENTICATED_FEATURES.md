# Guest vs. Authenticated User Features

> **Important**: Authentication is 100% OPTIONAL. All core e-commerce features work without an account.

## Quick Comparison

| Feature | Guest User | Logged-In User |
|---------|-----------|----------------|
| Browse product catalog | ✅ Full access | ✅ Full access |
| Search products | ✅ Full access | ✅ Full access |
| Add products to cart | ✅ Full access | ✅ Full access |
| Configure products (cut-to-length, finish, etc.) | ✅ Full access | ✅ Full access |
| Upload BOM files | ✅ Full access | ✅ Full access |
| Auto-match BOM to products | ✅ Full access | ✅ Full access |
| Submit RFQ (Request for Quote) | ✅ Full access | ✅ **Auto-filled with company data** |
| Save BOM projects for reuse | ❌ Must create account | ✅ **Save unlimited projects** |
| View order history | ❌ Not available | ✅ **Track all submitted RFQs** |
| Save multiple delivery addresses | ❌ Not available | ✅ **Quick address selection** |
| Company data auto-prefill | ❌ Manual entry each time | ✅ **Automatic prefill** |
| Edit profile & company info | ❌ Not available | ✅ **Manage account details** |

---

## Guest User Experience

### ✅ What You CAN Do (No Account Required)

1. **Browse & Search**
   - View all products in catalog
   - Use filters (family, grade, standard, availability)
   - Search with autocomplete

2. **Configure Products**
   - Select selling units (kg, m, pcs)
   - Choose lengths and finishes
   - Use cut-to-length calculator
   - Estimate weights and prices

3. **Cart & RFQ**
   - Add products to cart
   - View cart summary
   - Submit Request for Quote (RFQ)
   - Manually enter company details

4. **BOM Upload**
   - Upload CSV/Excel BOM files
   - Auto-match products from catalog
   - Manually map unmatched rows
   - Add matched products to cart

### ❌ What You CANNOT Do

- Save BOM projects for later reuse
- View history of submitted RFQs
- Save delivery addresses
- Auto-fill company data in RFQ forms

---

## Authenticated User Benefits

### ✨ Time-Saving Features

1. **RFQ Form Auto-Prefill**
   - Company name, CUI, address automatically filled
   - Contact information pre-populated
   - Edit any field before submission
   - No repetitive data entry

2. **Saved BOM Projects**
   - Save uploaded BOM files with custom names
   - Add descriptions to projects
   - Load saved projects instantly
   - Reuse projects across multiple orders
   - Track last usage date

3. **Multiple Delivery Addresses**
   - Save billing and delivery addresses
   - Set default addresses per type
   - Quick selection during RFQ submission
   - No re-entering addresses

4. **Order History & Tracking**
   - View all submitted RFQs
   - Track status (Submitted → Acknowledged → In Progress → Quoted → Completed)
   - View quote details (price, validity, notes)
   - Access full order details anytime

### 📊 Account Management

1. **Profile Management**
   - Update name, phone, email
   - Change password securely
   - Manage account type (Business / Individual)

2. **Company Information** (Business Accounts)
   - Save company legal name
   - Store CUI (VAT number)
   - Manage company address
   - Business verification status

---

## Account Types

### Individual Account
- Personal profile information
- Saved addresses
- Saved BOM projects
- Order history

### Business Account
- All Individual features, plus:
- Company information tab
- CUI (VAT) validation
- Company address management
- Business verification status

---

## Getting Started

### Stay as Guest
1. Browse catalog → Add to cart → Submit RFQ
2. Enter company details manually each time
3. No project saving or history tracking

### Create Free Account
1. Click "Cont" in header
2. Choose "Creează unul" (Create account)
3. Fill personal info (required)
4. Optionally add company details
5. Start enjoying time-saving benefits

**Or skip account creation anytime** - click "Continuă fără cont" on login/signup pages.

---

## Privacy & Data

- **Guest users**: No data stored (except cart in browser session)
- **Authenticated users**: Data stored locally (localStorage) for demo purposes
- **Production**: Will use secure backend with proper authentication

---

**Last Updated**: 2025-11-09
**Version**: 1.0.0
