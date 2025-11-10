Setting Up Google Tag Manager

Step 1: Create a GTM Account & Container

1. Go to Google Tag Manager
   - Visit: https://tagmanager.google.com/
   - Sign in with your Google account
2. Create an Account
   - Click "Create Account" button
   - Fill in account details:
    - Account Name: "MetalPro" (or your company name)
    - Country: Romania (or your country)
    - Container Name: "MetalPro Website"
    - Target Platform: Select Web
      - Click "Create"
      - Accept the Terms of Service
3. Get Your GTM ID
   - After creation, you'll see a popup with installation code
   - Look for the GTM ID - it looks like: GTM-XXXXXXX (7 characters after GTM-)
   - Copy this ID - you'll need it!

Step 2: Configure Your Project

1. Create/Update .env file in steel-craft-flow/ directory:

# Google Tag Manager
VITE_GTM_ID=GTM-XXXXXXX  # Replace with your actual GTM ID

# Other environment variables (optional for now)
VITE_API_URL=http://localhost:3001
VITE_ENV=development

2. Create .env.example (if not already done):
   VITE_GTM_ID=GTM-XXXXXXX
   VITE_API_URL=http://localhost:3001
   VITE_ENV=development

3. Restart your dev server for the environment variable to take effect:
   npm run dev

Step 3: Verify GTM Installation

1. Check Browser Console:
   - Open your app in the browser
   - Open DevTools (F12)
   - Go to Console tab
   - You should see GTM initialization logs
2. Check dataLayer:
   - In Console, type: window.dataLayer
   - You should see an array with events
   - Type: dataLayer to see all events
3. Install GTM Preview Mode:
   - In GTM interface, click "Preview" button (top right)
   - Enter your local URL: http://localhost:8080
   - Click "Connect"
   - A debug window will open showing all events

Step 4: Configure GTM Tags (Important!)

Your app is now sending events to GTM, but you need to configure tags to send data to analytics platforms:

For Google Analytics 4 (GA4):

1. Create GA4 Property (if you don't have one):
   - Go to: https://analytics.google.com/
   - Create a new GA4 property
   - Get your Measurement ID (looks like G-XXXXXXXXXX)
2. In GTM, create GA4 Configuration Tag:
   - Go to "Tags" → "New"
   - Tag Configuration → Choose "Google Analytics: GA4 Configuration"
   - Enter your Measurement ID
   - Triggering → Choose "All Pages"
   - Save
3. Create Event Tags (for custom events):
   - Go to "Tags" → "New"
   - Tag Configuration → Choose "Google Analytics: GA4 Event"
   - Configuration Tag → Select your GA4 config tag
   - Event Name → {{Event}} (use dataLayer variable)
   - Add Event Parameters from dataLayer
   - Triggering → Create custom trigger for each event type
   - Save

Step 5: Test Everything

1. Use Preview Mode:
# Start your dev server
npm run dev
2. In GTM:
   - Click "Preview"
   - Connect to http://localhost:8080
   - Navigate through your app
3. Verify Events:
   - Check that these events fire:
    - page_view - on every page load
    - catalog_view - when viewing catalog
    - pdp_view - when viewing product details
    - add_to_estimate - when adding to cart
    - estimate_update - when cart changes
    - bom_upload - when uploading BOM
    - rfq_start, rfq_step, rfq_submit - RFQ flow
    - search - when searching
    - login, signup - authentication
    - contact_click - clicking phone/email

Step 6: Publish Container

Once you've verified everything works:

1. In GTM, click "Submit" (top right)
2. Add version name: "Initial Setup - Analytics Events"
3. Add description: "Configured all MetalPro analytics events"
4. Click "Publish"

Common Issues & Solutions

Issue: window.dataLayer is undefined
- Solution: Check that .env file has the correct GTM ID
- Restart dev server after adding .env

Issue: Events not showing in Preview Mode
- Solution: Make sure you clicked "Connect" in Preview Mode
- Check browser console for errors

Issue: Events showing but not in GA4
- Solution: You need to create GA4 tags in GTM (Step 4)

Issue: GTM script not loading
- Solution: Check that initializeGTM() is called in App.tsx
- Verify the GTM ID format is correct (GTM-XXXXXXX)

Quick Reference: Your GTM Events

Here are all the events your app is tracking:

| Event Name      | When It Fires       | Key Data                  |
  |-----------------|---------------------|---------------------------|
| page_view       | Every page load     | path, title               |
| catalog_view    | Catalog page view   | category                  |
| filter_apply    | Filters applied     | filter details            |
| pdp_view        | Product detail view | product info              |
| add_to_estimate | Add to cart         | product, quantity, price  |
| estimate_update | Cart changes        | item count, weight, price |
| bom_upload      | BOM file uploaded   | file info, match stats    |
| rfq_start       | RFQ flow begins     | source                    |
| rfq_step        | RFQ step completed  | step number, name         |
| rfq_submit      | RFQ submitted       | reference, totals         |
| search          | Search performed    | query, result count       |
| login           | User logs in        | account type              |
| signup          | User signs up       | account type              |
| contact_click   | Contact clicked     | type (phone/email)        |
