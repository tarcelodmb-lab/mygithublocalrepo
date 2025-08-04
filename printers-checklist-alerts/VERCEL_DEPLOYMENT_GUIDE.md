# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- Your code pushed to GitHub

## Step 1: Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your GitHub repository

## Step 2: Configure Environment Variables
In Vercel dashboard, add these environment variables:

```
VITE_SHOPIFY_API_KEY=your_client_id_from_partner_dashboard
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Deploy
1. Click "Deploy" - Vercel will build automatically
2. Get your deployment URL (e.g., `https://your-app.vercel.app`)

## Step 4: Update Shopify Configuration
1. Update `shopify.app.toml`:
   ```toml
   application_url = "https://your-app.vercel.app"
   ```

2. Update redirect URLs in Shopify Partner Dashboard:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/auth/shopify/callback
   ```

## Step 5: Test
1. Install app in your development store
2. Verify authentication works
3. Test all features

Your app is now live! 🚀