# Deploy React App as Shopify App

## Prerequisites
1. Install Shopify CLI: `npm install -g @shopify/cli @shopify/theme`
2. Create Shopify Partner account: https://partners.shopify.com/
3. Node.js 18+ installed

## Step 1: Convert to Shopify App Structure
```bash
# Create new Shopify app
shopify app init your-app-name
cd your-app-name

# Copy your existing React components to web/frontend/
cp -r src/* web/frontend/src/
cp package.json web/frontend/
```

## Step 2: Update package.json
Add to web/frontend/package.json:
```json
{
  "dependencies": {
    "@shopify/app-bridge": "^3.7.0",
    "@shopify/app-bridge-react": "^3.7.0",
    "@shopify/polaris": "^11.0.0"
  }
}
```

## Step 3: Create App Configuration
Create `shopify.app.toml`:
```toml
name = "Printer Maintenance Tracker"
client_id = "your_client_id"
application_url = "https://your-app.com"
embedded = true

[access_scopes]
scopes = "read_products,write_products"

[auth]
redirect_urls = ["https://your-app.com/auth/callback"]

[webhooks]
api_version = "2023-10"
```

## Step 4: Deploy
```bash
# Login to Shopify
shopify auth login

# Deploy app
shopify app deploy

# Generate app URL
shopify app info --web-env
```

## Step 5: App Store Submission
1. Complete app listing in Partner Dashboard
2. Add app screenshots and description
3. Submit for review
4. Wait for approval (7-14 days)

## Important Notes
- Your app will run in an iframe within Shopify admin
- Use Shopify Polaris for consistent UI
- Handle Shopify authentication via App Bridge
- Test thoroughly in development store first