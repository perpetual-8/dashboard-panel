# Delta Dashboard

A modern, responsive e-commerce admin dashboard built with Vue.js 3 and Node.js. It features real-time analytics, product management, and inventory control, delivering a sleek, data-driven experience for admins.

---

## 🚀 Features

### 📊 Revenue Analytics
- Real-time sales and order tracking
- Interactive charts (Chart.js via vue-chartjs)
- Time-based filters (daily, weekly, monthly, yearly)
- Category-wise revenue breakdown

### 📦 Inventory Management
- AG Grid-powered product data grid
- Live stock updates with inline editing
- Smart filtering and search
- Low inventory alerts

### 🛍 Product Management
- Product registration with image upload
- Form validation and instant updates
- Drag & drop upload UI with preview

### ⚙️ Backend API
- RESTful Express API
- Full CRUD operations on `/api/products`
- JSON file-based mock storage
- CORS enabled for frontend access

---

## 🧱 Tech Stack

### Frontend
- **Vue.js 3** + Composition API
- **Bootstrap 5** + Bootstrap Icons
- **AG Grid** for data tables
- **Chart.js** via `vue-chartjs`
- **Vue Router** for SPA navigation
- **Vite** for lightning-fast dev/build
- **SASS** for styling

### Backend
- **Node.js** + **Express**
- **Multer** for image handling
- **CORS** for frontend-backend integration
- **Nodemon** for hot reload

---

## ⚡ Quick Start

```bash
# Clone the repo
git clone https://github.com/perpetual-8/dashboard-panel.git
cd dashboard-panel

# Install dependencies (frontend + backend)
npm run install:all

# Start development servers
npm run dev
