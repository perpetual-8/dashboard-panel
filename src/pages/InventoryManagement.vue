<template>
  <div class="inventory-container">
    <h2 class="mb-4">Inventory Management</h2>

    <!-- Search and Filter -->
    <div class="inventory-controls mb-4 d-flex flex-wrap gap-3">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control w-auto"
        placeholder="Search products..."
      />
      <select v-model="filterCategory" class="form-select w-auto">
        <option value="All">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select v-model="sortField" class="form-select w-auto">
        <option value="name">Name</option>
        <option value="stock">Stock</option>
        <option value="price">Price</option>
      </select>
      <select v-model="sortOrder" class="form-select w-auto">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <!-- Inventory Table -->
    <div class="ag-theme-alpine" style="height: 400px;">
      <ag-grid-vue
        :rowData="filteredProducts"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        @cell-value-changed="onCellValueChanged"
      ></ag-grid-vue>
    </div>

    <!-- Low Inventory Alert -->
    <div v-if="lowInventoryProducts.length" class="alert alert-warning mt-4">
      <h5>Low Inventory Alerts</h5>
      <ul>
        <li v-for="product in lowInventoryProducts" :key="product.id">
          {{ product.name }} ({{ product.category }}) - {{ product.stock }} units remaining
          <small>(Restock recommended)</small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

// Sample data (Amazon/Walmart-like products)
const products = ref([
  { id: 1, name: 'Wireless Earbuds', category: 'Electronics', price: 59.99, stock: 15 },
  { id: 2, name: 'Denim Jeans', category: 'Clothing', price: 39.99, stock: 8 },
  { id: 3, name: 'Smart Watch', category: 'Electronics', price: 199.99, stock: 5 },
  { id: 4, name: 'Leather Wallet', category: 'Accessories', price: 29.99, stock: 25 },
  { id: 5, name: 'T-Shirt', category: 'Clothing', price: 19.99, stock: 12 },
])

const categories = ['All', 'Electronics', 'Clothing', 'Accessories']
const searchQuery = ref('')
const filterCategory = ref('All')
const sortField = ref('name')
const sortOrder = ref('asc')

// Ag-Grid column definitions
const columnDefs = ref([
  { field: 'name', headerName: 'Product Name', sortable: true, filter: true },
  { field: 'category', headerName: 'Category', sortable: true, filter: true },
  { field: 'price', headerName: 'Price ($)', sortable: true, valueFormatter: params => `$${params.value.toFixed(2)}` },
  { field: 'stock', headerName: 'Stock', sortable: true, editable: true },
])

const defaultColDef = ref({
  flex: 1,
  minWidth: 100,
  resizable: true,
})

// Computed for filtered and sorted products
const filteredProducts = computed(() => {
  let filtered = [...products.value]
  
  // Search
  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Filter by category
  if (filterCategory.value !== 'All') {
    filtered = filtered.filter(product => product.category === filterCategory.value)
  }
  
  // Sort
  filtered.sort((a, b) => {
    const field = sortField.value
    const order = sortOrder.value === 'asc' ? 1 : -1
    return a[field] > b[field] ? order : -order
  })
  
  return filtered
})

// Low inventory alert (threshold: 10 units)
const lowInventoryProducts = computed(() => 
  products.value.filter(product => product.stock <= 10)
)

// Update inventory on cell edit
const onCellValueChanged = (event) => {
  const product = products.value.find(p => p.id === event.data.id)
  if (product && event.colDef.field === 'stock') {
    product.stock = Number(event.newValue)
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #007bff;
$success-color: #28a745;
$danger-color: #dc3545;
$light-gray: #f8f9fa;
$border-color: #e9ecef;
$text-muted: #6c757d;

.inventory-container {
  background: white;
  border-radius: 12px;
  border: 1px solid $border-color;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-color: $primary-color;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
  }

  .inventory-controls {
    .form-control,
    .form-select {
      border-radius: 8px;
      border: 1px solid $border-color;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      transition: all 0.2s ease;

      &:focus {
        border-color: $primary-color;
        box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
      }
    }
  }

  .alert {
    border-radius: 8px;
    padding: 1rem;
    background: rgba($danger-color, 0.1);
    color: #2c3e50;

    h5 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    ul {
      margin: 0;
      padding-left: 1.5rem;
      font-size: 0.875rem;
    }
  }
}

@media (max-width: 768px) {
  .inventory-container {
    padding: 1rem;

    .inventory-controls {
      flex-direction: column;
      align-items: stretch;

      .form-control,
      .form-select {
        width: 100% !important;
      }
    }
  }
}
</style>