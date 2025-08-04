# Complete Shopify App Deployment Setup

## Prerequisites
1. **Shopify Partner Account**: Create at https://partners.shopify.com/
2. **Development Store**: Create a test store in your Partner Dashboard
3. **Node.js 18+** and **npm** installed
4. **Shopify CLI**: 
   - **macOS**: `sudo npm install -g @shopify/cli @shopify/theme`
   - **If permission errors**: Use `npx @shopify/cli` instead of global install
   - **Alternative**: Install via Homebrew: `brew tap shopify/shopify && brew install shopify-cli`

## Step 1: Create Shopify App in Partner Dashboard

1. Go to your Partner Dashboard
2. Click "Apps" → "Create app"
3. Choose "Create app manually"
4. Fill in:
   - **App name**: "CobraFlex Maintenance Tracker"
   - **App URL**: `https://your-domain.com` (we'll update this)
   - **Allowed redirection URL(s)**:
     - `https://your-domain.com/auth/callback`
     - `https://your-domain.com/auth/shopify/callback`

5. **Save your Client ID and Client Secret** - you'll need these!

## Step 2: Configure Environment Variables

Create `.env` file in your project root:
```env
VITE_SHOPIFY_API_KEY=your_client_id_here
SHOPIFY_API_SECRET=your_client_secret_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Update shopify.app.toml

Replace placeholders with your actual values:
```toml
client_id = "your_actual_client_id"
application_url = "https://your-actual-domain.com"
dev_store_url = "your-dev-store.myshopify.com"
```

## Step 4: Deploy Options

### Option A: Deploy to Vercel/Netlify
1. Build the project: `npm run build`
2. Deploy `dist/` folder to your hosting platform
3. Update `application_url` in shopify.app.toml with your live URL

### Option B: Use Shopify CLI (Recommended)
```bash
# Login to Shopify
shopify auth login

# Start development server
shopify app dev

# Deploy when ready
shopify app deploy
```

## Step 5: Configure App Permissions

In Partner Dashboard → Your App → App setup:
1. **Scopes**: Enable required permissions
   - `read_products, write_products`
   - `read_customers, write_customers`
2. **Webhooks**: Configure if needed
3. **App extensions**: Set up if using

## Step 6: Test Installation

1. Go to your development store admin
2. Navigate to Apps → Develop apps
3. Install your app
4. Test all functionality

## Step 7: App Store Submission (Optional)

1. Complete app listing in Partner Dashboard
2. Add screenshots, description, pricing
3. Submit for review (7-14 days approval time)

## Troubleshooting

### macOS Installation Issues:
- **Permission denied**: Try `sudo npm install -g @shopify/cli @shopify/theme`
- **Still failing**: Use `npx @shopify/cli` for commands instead of global install
- **Best option**: Install via Homebrew: `brew install shopify-cli`

### App Issues:
- **CORS errors**: Ensure your domain is whitelisted in app settings
- **Authentication issues**: Check API keys and redirect URLs
- **Iframe issues**: Verify `embedded = true` in shopify.app.toml

Need help with any specific step?