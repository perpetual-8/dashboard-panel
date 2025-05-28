# E-commerce Admin Dashboard

A modern, responsive admin dashboard for e-commerce management built with Vue.js 3. Features real-time analytics, inventory management, and product registration with interactive data visualizations.

## Features

**Revenue Analytics**
- Real-time sales and order tracking
- Interactive charts with Vue chart.js wrapped over Chart.js
- Time-based filtering (daily, weekly, monthly, yearly)
- Category-wise revenue breakdown

**Inventory Management**
- Advanced data grid with AG Grid
- Real-time stock level updates
- Smart search and filtering
- Low inventory alerts

**Product Management**
- Easy product registration form
- Image upload functionality
- Instant dashboard updates
- Form validation and error handling

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Bootstrap 5** - Responsive UI components
- **AG Grid** - Feature-rich data tables
- **Chart.js** - Interactive data visualization
- **Vue Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **SASS** - CSS preprocessing

## Quick Start

```bash
# Clone repository
git clone https://github.com/perpetual-8/dashboard-panel.git
cd dashboard-panel

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   └── ui/              # Reusable UI components
├── pages/
│   ├── RevenueAnalysis.vue
│   ├── InventoryManagement.vue
│   └── ProductRegistration.vue
├── layouts/
│   └── DashboardLayout.vue
├── router/              # Vue Router configuration
└── assets/              # Static assets and styles
```

## Development

The project uses modern Vue.js patterns with Composition API and follows component-based architecture. Each page is modular and reusable with proper separation of concerns.

**Key Files:**
- `pages/` - Main dashboard pages
- `components/ui/` - Shared components (BaseInput, BaseSelect, etc.)
- `layouts/` - Layout wrapper for consistent design
- `public/data/` - Sample JSON data for development

## Sample Data

Includes realistic e-commerce data:
- Product inventory with categories and stock levels
- Historical sales data for analytics
- Revenue data across multiple time periods

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - Built for demonstration purposes.

---

**Clean code, modern architecture, production-ready.**