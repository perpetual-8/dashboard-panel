<template>
  <div class="product-registration-container">
    <h2 class="mb-4">Add New Product</h2>
    <form @submit.prevent="submitProduct" class="product-form">
      <div class="mb-3">
        <label for="productName" class="form-label">Product Name</label>
        <input
          v-model="form.name"
          type="text"
          class="form-control"
          id="productName"
          placeholder="Enter product name"
          required
        />
      </div>
      <div class="mb-3">
        <label for="productDescription" class="form-label">Description</label>
        <textarea
          v-model="form.description"
          class="form-control"
          id="productDescription"
          rows="4"
          placeholder="Enter product description"
          required
        ></textarea>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="productPrice" class="form-label">Price ($)</label>
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            class="form-control"
            id="productPrice"
            placeholder="Enter price"
            required
          />
        </div>
        <div class="col-md-6">
          <label for="productStock" class="form-label">Initial Stock</label>
          <input
            v-model.number="form.stock"
            type="number"
            class="form-control"
            id="productStock"
            placeholder="Enter stock level"
            required
          />
        </div>
      </div>
      <div class="mb-3">
        <label for="productCategory" class="form-label">Category</label>
        <select v-model="form.category" class="form-select" id="productCategory" required>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="productImage" class="form-label">Product Image</label>
        <input
          type="file"
          class="form-control"
          id="productImage"
          accept="image/*"
          @change="handleImageUpload"
        />
        <small v-if="imagePreview" class="text-muted">
          Preview: <img :src="imagePreview" alt="Preview" class="image-preview" />
        </small>
      </div>
      <button type="submit" class="btn btn-primary">Add Product</button>
      <div v-if="successMessage" class="alert alert-success mt-3">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const categories = ['Electronics', 'Clothing', 'Accessories']
const form = ref({
  name: '',
  description: '',
  price: null,
  stock: null,
  category: categories[0],
  image: null,
})
const imagePreview = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    form.value.image = file
    imagePreview.value = URL.createObjectURL(file)
  } else {
    errorMessage.value = 'Please upload a valid image file'
  }
}

const submitProduct = () => {
  if (!form.value.name || !form.value.description || !form.value.price || !form.value.stock || !form.value.category) {
    errorMessage.value = 'All fields are required'
    return
  }
  
  // Simulate adding product to inventory (in a real app, this would be a backend API call)
  const newProduct = {
    id: Date.now(), // Simple ID generation for demo
    name: form.value.name,
    category: form.value.category,
    price: form.value.price,
    stock: form.value.stock,
  }
  
  // Reset form
  form.value = { name: '', description: '', price: null, stock: null, category: categories[0], image: null }
  imagePreview.value = null
  successMessage.value = `${newProduct.name} added to inventory successfully!`
  errorMessage.value = ''
  
  // Simulate inventory update (in a real app, emit event or update shared state)
  console.log('New Product:', newProduct)
}
</script>

<style lang="scss" scoped>
$primary-color: #007bff;
$success-color: #28a745;
$danger-color: #dc3545;
$light-gray: #f8f9fa;
$border-color: #e9ecef;
$text-muted: #6c757d;

.product-registration-container {
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

  .product-form {
    max-width: 600px;

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #2c3e50;
    }

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

    .btn-primary {
      background: $primary-color;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background: darken($primary-color, 10%);
        box-shadow: 0 2px 4px rgba($primary-color, 0.3);
      }
    }

    .image-preview {
      max-width: 100px;
      margin-top: 0.5rem;
      border-radius: 8px;
    }

    .alert {
      border-radius: 8px;
      padding: 0.75rem;
      font-size: 0.875rem;
    }
  }
}

@media (max-width: 768px) {
  .product-registration-container {
    padding: 1rem;

    .product-form {
      .form-control,
      .form-select {
        font-size: 0.8rem;
      }

      .btn-primary {
        width: 100%;
      }
    }
  }
}
</style>