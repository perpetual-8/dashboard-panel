<template>
  <div class="inventory-container container mt-4">
    <h2 class="mb-4">Inventory Management</h2>

    <div class="inventory-controls d-flex flex-wrap gap-3 mb-4">
      <div class="control-group flex-grow-1" style="min-width: 200px">
        <BaseInput
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          @update:modelValue="searchQuery = $event"
        />
      </div>

      <div class="control-group" style="min-width: 180px">
        <BaseSelect
          v-model="filterCategory"
          @update:modelValue="filterCategory = $event"
        >
          <option value="All">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </BaseSelect>
      </div>

      <div class="control-group" style="min-width: 140px">
        <BaseSelect v-model="sortField" @update:modelValue="sortField = $event">
          <option value="name">Name</option>
          <option value="stock">Stock</option>
          <option value="price">Price</option>
        </BaseSelect>
      </div>

      <div class="control-group" style="min-width: 140px">
        <BaseSelect v-model="sortOrder" @update:modelValue="sortOrder = $event">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </BaseSelect>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading products...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <h5>
        <i class="bi bi-exclamation-circle me-2"></i>Error Loading Products
      </h5>
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
      v-else-if="
        !loading && products.length > 0 && filteredProducts.length === 0
      "
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
      <h5>
        <i class="bi bi-exclamation-triangle me-2"></i>Low Inventory Alerts
      </h5>
      <ul class="mb-0">
        <li v-for="product in lowInventoryProducts" :key="product.id">
          <strong>{{ product.name }}</strong> ({{ product.category }}) -
          <span class="text-danger">{{ product.stock }} units</span> remaining
          <small class="text-muted">(Restock recommended)</small>
        </li>
      </ul>
    </div>

    <!-- Edit Product Modal -->

    <div
      class="modal fade"
      id="editProductModal"
      tabindex="-1"
      aria-labelledby="editProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editProductModalLabel">Edit Product</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label for="editName" class="form-label">Product Name</label>
                <BaseInput
                  v-model="editProductData.name"
                  type="text"
                  id="editName"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="editCategory" class="form-label">Category</label>
                <BaseSelect
                  v-model="editProductData.category"
                  id="editCategory"
                  required
                >
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </BaseSelect>
              </div>
              <div class="mb-3">
                <label for="editPrice" class="form-label">Price ($)</label>
                <BaseInput
                  v-model.number="editProductData.price"
                  type="number"
                  id="editPrice"
                  step="0.01"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="editStock" class="form-label">Stock</label>
                <BaseInput
                  v-model.number="editProductData.stock"
                  type="number"
                  id="editStock"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      class="modal fade"
      id="deleteProductModal"
      tabindex="-1"
      aria-labelledby="deleteProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteProductModalLabel">
              Confirm Delete
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete
            <strong>{{ deleteProductData.name }}</strong
            >?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmDeleteProduct"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import * as bootstrap from "bootstrap";
import BaseInput from "@/components/microUI/BaseInput.vue";
import BaseSelect from "@/components/microUI/BaseSelect.vue";

const products = ref([]);
const categories = ["Electronics", "Clothing", "Accessories"];
const searchQuery = ref("");
const filterCategory = ref("All");
const sortField = ref("name");
const sortOrder = ref("asc");
const loading = ref(false);
const error = ref("");
const editProductData = ref({});
const deleteProductData = ref({});

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
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    cellRenderer: (params) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <button class="btn btn-outline-primary btn-sm me-1" data-action="edit">Edit</button>
        <button class="btn btn-outline-danger btn-sm" data-action="delete">Delete</button>
      `;
      div
        .querySelector("[data-action='edit']")
        .addEventListener("click", () => editProduct(params.data));
      div
        .querySelector("[data-action='delete']")
        .addEventListener("click", () => deleteProduct(params.data));
      return div;
    },
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

const onCellValueChanged = async (event) => {
  const product = products.value.find((p) => p.id === event.data.id);
  if (product && event.colDef.field === "stock") {
    const newStock = Number(event.newValue);
    if (!isNaN(newStock) && newStock >= 0) {
      try {
        const res = await fetch(
          `http://localhost:3001/api/products/${product.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...product, stock: newStock }),
          }
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        product.stock = newStock;
      } catch (err) {
        error.value = `Failed to update stock: ${err.message}`;
        event.node.setDataValue(event.colDef.field, event.oldValue);
      }
    } else {
      event.node.setDataValue(event.colDef.field, event.oldValue);
    }
  }
};

const editProduct = (product) => {
  editProductData.value = { ...product };
  const modal = new bootstrap.Modal(
    document.getElementById("editProductModal")
  );
  modal.show();
};
const saveProduct = async () => {
  const product = { ...editProductData.value }; // Create a copy to avoid direct mutation
  if (
    product.name &&
    product.category &&
    product.price >= 0 &&
    product.stock >= 0
  ) {
    try {
      const res = await fetch(
        `http://localhost:3001/api/products/${product.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || `HTTP error! status: ${res.status}`);

      // Update local products array
      const index = products.value.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        products.value[index] = { ...product }; // Ensure reactivity
        products.value = [...products.value]; // Trigger reactivity
      }

      bootstrap.Modal.getInstance(
        document.getElementById("editProductModal")
      ).hide();
      error.value = ""; // Clear any previous errors
    } catch (err) {
      error.value = `Failed to update product: ${err.message}`;
    }
  } else {
    error.value = "Please fill all fields correctly.";
  }
};

const confirmDeleteProduct = async () => {
  const id = deleteProductData.value.id;
  try {
    const res = await fetch(`http://localhost:3001/api/products/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || `HTTP error! status: ${res.status}`);

    // Update local products array
    products.value = products.value.filter((p) => p.id !== id);

    bootstrap.Modal.getInstance(
      document.getElementById("deleteProductModal")
    ).hide();
    error.value = ""; // Clear any previous errors
  } catch (err) {
    error.value = `Failed to delete product: ${err.message}`;
  }
};

const deleteProduct = (product) => {
  deleteProductData.value = product;
  const modal = new bootstrap.Modal(
    document.getElementById("deleteProductModal")
  );
  modal.show();
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
  const style = document.createElement("style");
  style.textContent = `
    .ag-root-wrapper-body.ag-layout-normal {
      height: 100%;
     border-radius:8px !important;
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
  // min-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    // border-color: $primary-color;
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
    border: 0px solid;
    // height: calc(100vh - 250px);
    width: 100%;
    flex-grow: 1;
    --ag-border-color: rgba(0, 0, 0, 0.1);
    --ag-wrapper-border-radius: 8px;

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
    // min-height: calc(100vh - 2rem);

    .inventory-controls {
      flex-direction: column;
      align-items: stretch;

      .form-control,
      .form-select {
        width: 100%;
      }
    }

    // .ag-theme-alpine {
    //   height: calc(100vh - 300px);
    // }
  }
}
</style>
