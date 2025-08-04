# CobraFlex Maintenance Tracker - Shopify App

A comprehensive maintenance tracking system for CobraFlex printers, designed as a Shopify app for easy integration into merchant workflows.

## Features

- **Task Management**: Create and manage maintenance tasks with different frequencies (daily, weekly, monthly, quarterly, yearly)
- **User Roles**: Admin and customer dashboards with role-based access
- **Preset System**: Admins can create maintenance presets and assign them to specific users/serial numbers
- **Task Cycling**: Automatic task reset based on frequency cycles
- **Award System**: Gamification with awards for completed maintenance tasks
- **Shopify Integration**: Full Shopify App Bridge integration for embedded experience

## Shopify App Installation

### Prerequisites
1. Shopify Partner Account
2. Node.js 18+
3. Shopify CLI installed: `npm install -g @shopify/cli`

### Installation Steps

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd cobraflex-maintenance-tracker
   npm install
   ```

2. **Configure Shopify App**
   - Update `shopify.app.toml` with your app details
   - Set your client_id and application_url
   - Configure redirect URLs

3. **Environment Variables**
   Create `.env` file:
   ```
   VITE_SHOPIFY_API_KEY=your_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Deploy to Shopify**
   ```bash
   shopify auth login
   shopify app deploy
   ```

5. **Install in Development Store**
   ```bash
   shopify app dev
   ```

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database + Auth)
- **Shopify Integration**: App Bridge 3.0
- **State Management**: React Context + Local Storage

## Key Components

- `ShopifyProvider`: Handles Shopify App Bridge initialization
- `AdminDashboard`: Management interface for admins
- `CustomerDashboard`: Task interface for end users
- `PresetManager`: Create and manage task presets
- `UserPresetAssignment`: Assign presets to users

## Development

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Shopify App Store Submission

1. Complete app listing in Partner Dashboard
2. Add screenshots and detailed description
3. Test thoroughly in development store
4. Submit for review (7-14 days approval time)

## Support

For technical support or questions about the maintenance tracking system, please contact the development team.