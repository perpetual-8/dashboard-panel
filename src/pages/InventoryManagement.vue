 <template>
  <div class="inventory-container container mt-4">
    <h2 class="mb-4">Inventory Management</h2>

    <div class="inventory-controls mb-4 d-flex flex-wrap gap-3">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control w-auto"
        placeholder="Search products..."
      />
      <select v-model="filterCategory" class="form-select w-auto">
        <option value="All">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
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

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading products...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <h5><i class="bi bi-exclamation-circle me-2"></i>Error Loading Products</h5>
      <p>{{ error }}</p>
      <button @click="fetchProducts" class="btn btn-outline-danger btn-sm">
        Try Again
      </button>
    </div>

    <div
      v-else-if="!loading && products.length === 0"
      class="alert alert-info text-center py-5"
    >
      <h5><i class="bi bi-box-seam me-2"></i>No Products Found</h5>
      <p>No products have been added to inventory yet.</p>
    </div>

    <div
      v-else-if="!loading && products.length > 0 && filteredProducts.length === 0"
      class="alert alert-warning text-center py-4"
    >
      <h5><i class="bi bi-search me-2"></i>No Results Found</h5>
      <p>No products match your current search and filter criteria.</p>
      <button @click="clearFilters" class="btn btn-outline-warning btn-sm">
        Clear Filters
      </button>
    </div>

    <div v-else class="ag-theme-alpine">
      <ag-grid-vue
        :rowData="filteredProducts"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        @cell-value-changed="onCellValueChanged"
        :animateRows="true"
        :pagination="true"
        :paginationPageSize="20"
        :suppressCellFocus="false"
        :enableCellTextSelection="true"
        @grid-ready="onGridReady"
        domLayout="normal"
      ></ag-grid-vue>
    </div>

    <div
      v-if="!loading && lowInventoryProducts.length"
      class="alert alert-warning mt-4"
    >
      <h5><i class="bi bi-exclamation-triangle me-2"></i>Low Inventory Alerts</h5>
      <ul class="mb-0">
        <li v-for="product in lowInventoryProducts" :key="product.id">
          <strong>{{ product.name }}</strong> ({{ product.category }}) -
          <span class="text-danger">{{ product.stock }} units</span> remaining
          <small class="text-muted">(Restock recommended)</small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const products = ref([]);
const categories = ["Electronics", "Clothing", "Accessories"];
const searchQuery = ref("");
const filterCategory = ref("All");
const sortField = ref("name");
const sortOrder = ref("asc");
const loading = ref(false);
const error = ref("");

const columnDefs = [
  {
    field: "name",
    headerName: "Product Name",
    sortable: true,
    filter: true,
    width: 200,
  },
  {
    field: "category",
    headerName: "Category",
    sortable: true,
    filter: true,
    width: 150,
  },
  {
    field: "price",
    headerName: "Price ($)",
    sortable: true,
    width: 120,
    valueFormatter: (params) => `${Number(params.value || 0).toFixed(2)}`,
  },
  {
    field: "stock",
    headerName: "Stock",
    sortable: true,
    editable: true,
    width: 100,
    cellStyle: (params) =>
      params.value <= 10
        ? { backgroundColor: "#fff3cd", color: "#856404" }
        : null,
  },
];

const defaultColDef = {
  resizable: true,
  sortable: true,
  filter: true,
};

const filteredProducts = computed(() => {
  let filtered = [...products.value];
  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
    );
  }
  if (filterCategory.value !== "All") {
    filtered = filtered.filter(
      (product) => product.category === filterCategory.value
    );
  }
  const field = sortField.value;
  const order = sortOrder.value === "asc" ? 1 : -1;
  filtered.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (aVal > bVal) return order;
    if (aVal < bVal) return -order;
    return 0;
  });
  return filtered;
});

const lowInventoryProducts = computed(() =>
  products.value.filter((product) => product.stock <= 10)
);

const clearFilters = () => {
  searchQuery.value = "";
  filterCategory.value = "All";
  sortField.value = "name";
  sortOrder.value = "asc";
};

const gridApi = ref(null);
const columnApi = ref(null);

const onGridReady = (params) => {
  gridApi.value = params.api;
  columnApi.value = params.columnApi;
  params.api.sizeColumnsToFit();
};

const onCellValueChanged = (event) => {
  const product = products.value.find((p) => p.id === event.data.id);
  if (product && event.colDef.field === "stock") {
    const newStock = Number(event.newValue);
    if (!isNaN(newStock) && newStock >= 0) {
      product.stock = newStock;
    } else {
      event.node.setDataValue(event.colDef.field, event.oldValue);
    }
  }
};

const fetchProducts = async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch("http://localhost:3001/api/products");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      products.value = data;
    } else {
      throw new Error("Invalid data format received from server");
    }
  } catch (err) {
    error.value = `Failed to load products: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
  const style = document.createElement('style');
  style.textContent = `
    .ag-root-wrapper-body.ag-layout-normal {
      height: 100%;
      flex: 0 0 auto;
    }
  `;
  document.head.appendChild(style);
});
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
  max-width: 1200px;
  min-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;

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
    background: $light-gray;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid $border-color;

   
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

  .ag-theme-alpine {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    height: calc(100vh - 250px);
    width: 100%;
    flex-grow: 1;

    .ag-root-wrapper {
      height: 100%;
    }

    .ag-root-wrapper-body {
      height: 100%;
    }
  }
}

@media (max-width: 768px) {
  .inventory-container {
    padding: 1rem;
    min-height: calc(100vh - 2rem);

    .inventory-controls {
      flex-direction: column;
      align-items: stretch;

      .form-control,
      .form-select {
        width: 100%;
      }
    }

    .ag-theme-alpine {
      height: calc(100vh - 300px);
    }
  }
}
</style>