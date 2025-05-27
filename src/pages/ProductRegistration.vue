<template>
  <div class="product-registration-wrapper">
    <div class="container-fluid">
      <div class="row">
        <!-- Left Side - Form -->
        <div class="col-lg-6 col-md-12">
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
                <label for="productDescription" class="form-label"
                  >Description</label
                >
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
                <div class="col-sm-6">
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
                <div class="col-sm-6">
                  <label for="productStock" class="form-label"
                    >Initial Stock</label
                  >
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
                <select
                  v-model="form.category"
                  class="form-select"
                  id="productCategory"
                  required
                >
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <!-- Mobile Image Upload (hidden on larger screens) -->
              <div class="mb-3 mobile-image-upload">
                <label for="productImage" class="form-label"
                  >Product Image</label
                >
                <input
                  type="file"
                  class="form-control"
                  id="productImage"
                  accept="image/*"
                  @change="handleImageUpload"
                />
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
        </div>

        <!-- Right Side - Drag & Drop Image Uploader -->
        <div class="col-lg-6 col-md-12">
          <div class="image-uploader-container">
            <h3 class="mb-4">Product Image</h3>
            <div
              class="drag-drop-area"
              :class="{ 'drag-over': isDragOver, 'has-image': imagePreview }"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                class="file-input"
                accept="image/*"
                @change="handleImageUpload"
              />

              <div v-if="!imagePreview" class="upload-content">
                <div class="upload-icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <h4>Drag & Drop Image Here</h4>
                <p>or <span class="click-text">click to browse</span></p>
                <small class="text-muted"
                  >Supports: JPG, PNG, GIF (Max 5MB)</small
                >
              </div>

              <div v-if="imagePreview" class="image-preview-container">
                <img
                  :src="imagePreview"
                  alt="Product Preview"
                  class="image-preview"
                />
                <div class="image-overlay">
                  <button
                    type="button"
                    class="btn btn-outline-light btn-sm"
                    @click.stop="removeImage"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="3,6 5,6 21,6" />
                      <path
                        d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"
                      />
                    </svg>
                    Remove
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-light btn-sm"
                    @click.stop="triggerFileInput"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Replace
                  </button>
                </div>
              </div>
            </div>

            <div class="image-info mt-3">
              <div v-if="form.image" class="file-info">
                <strong>{{ form.image.name }}</strong>
                <span class="text-muted"
                  >({{ formatFileSize(form.image.size) }})</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const categories = ["Electronics", "Clothing", "Accessories"];

const form = ref({
  name: "",
  description: "",
  price: null,
  stock: null,
  category: categories[0],
  image: null,
});

const imagePreview = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const isDragOver = ref(false);
const fileInput = ref(null);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  processImageFile(file);
};

const handleDragOver = (event) => {
  isDragOver.value = true;
};

const handleDragLeave = (event) => {
  isDragOver.value = false;
};

const handleDrop = (event) => {
  isDragOver.value = false;
  const file = event.dataTransfer.files[0];
  processImageFile(file);
};

const processImageFile = (file) => {
  if (file && file.type.startsWith("image/")) {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      errorMessage.value = "File size must be less than 5MB";
      return;
    }
    form.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
    errorMessage.value = "";
  } else {
    errorMessage.value = "Please upload a valid image file";
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const removeImage = () => {
  form.value.image = null;
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const submitProduct = async () => {
  if (
    !form.value.name ||
    !form.value.description ||
    !form.value.price ||
    !form.value.stock ||
    !form.value.category
  ) {
    errorMessage.value = "All fields are required";
    return;
  }

  const productData = {
    name: form.value.name,
    description: form.value.description,
    price: form.value.price,
    stock: form.value.stock,
    category: form.value.category,
  };

  try {
    const response = await fetch("http://localhost:3001/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    const result = await response.json();

    if (result.success) {
      successMessage.value = `${result.product.name} added to inventory successfully!`;
      errorMessage.value = "";
      form.value = {
        name: "",
        description: "",
        price: null,
        stock: null,
        category: categories[0],
        image: null,
      };
      imagePreview.value = null;
    } else {
      errorMessage.value = "Failed to add product";
    }
  } catch (err) {
    errorMessage.value = "Error saving product: " + err.message;
  }
};
</script>

<style lang="scss" scoped>


.product-registration-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;

  @include respond-below(md) {
    padding: 1rem 0;
  }
}

.product-registration-container {
  background: white;
  border-radius: 16px;
  border: 1px solid $border-color;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: fit-content;

  @include respond-below(lg) {
    margin-bottom: 1rem;
  }

  @include respond-below(md) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 1.5rem;

    @include respond-below(md) {
      font-size: 1.5rem;
    }
  }

  .product-form {
    .form-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .form-control,
    .form-select {
      border-radius: 10px;
      border: 2px solid $border-color;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      transition: all 0.3s ease;

      &:focus {
        border-color: $color-primary;
        box-shadow: 0 0 0 4px rgba($primary-color, 0.1);
      }
    }

    .btn-primary {
      background: linear-gradient(
        135deg,
        $primary-color 0%,
        darken($primary-color, 15%) 100%
      );
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      @include respond-below(md) {
        width: 100%;
        padding: 1rem;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba($primary-color, 0.4);
      }
    }

    .alert {
      border-radius: 10px;
      padding: 1rem;
      font-size: 0.875rem;
      border: none;
    }
  }
}

.image-uploader-container {
  background: white;
  border-radius: 16px;
  border: 1px solid $border-color;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: fit-content;
  position: sticky;
  top: 2rem;

  @include respond-below(lg) {
    position: static;
    margin-top: 1rem;
  }

  @include respond-below(md) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 1.5rem;

    @include respond-below(md) {
      font-size: 1.25rem;
    }
  }
}

.drag-drop-area {
  border: 3px dashed $border-color;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: $light-gray;
  position: relative;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  @include respond-below(md) {
    padding: 2rem 1rem;
    min-height: 250px;
  }

  &.drag-over {
    border-color: $color-primary;
    background: rgba($primary-color, 0.05);
    transform: scale(1.02);
  }

  &.has-image {
    padding: 0;
    border: none;
    background: none;
  }

  &:hover:not(.has-image) {
    border-color: $color-primary;
    background: rgba($primary-color, 0.02);
  }
}

.upload-content {
  .upload-icon {
    color: $color-primary;
    margin-bottom: 1rem;

    svg {
      width: 64px;
      height: 64px;

      @include respond-below(md) {
        width: 48px;
        height: 48px;
      }
    }
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;

    @include respond-below(md) {
      font-size: 1.1rem;
    }
  }

  p {
    color: $text-muted;
    margin-bottom: 1rem;
    font-size: 1rem;

    .click-text {
      color: $color-primary;
      font-weight: 600;
    }
  }

  small {
    font-size: 0.875rem;
  }
}

.image-preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;

  .image-preview {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 16px;

    @include respond-below(md) {
      height: 250px;
    }
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;

    @include respond-below(md) {
      gap: 0.5rem;
    }

    .btn {
      border-radius: 8px;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      @include respond-below(md) {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }
    }
  }

  &:hover .image-overlay {
    opacity: 1;
  }
}

.file-input {
  display: none;
}

.image-info {
  .file-info {
    padding: 0.75rem;
    background: $light-gray;
    border-radius: 8px;
    font-size: 0.875rem;

    @include respond-below(md) {
      padding: 0.5rem;
    }
  }
}

.mobile-image-upload {
  @include respond-above(lg) {
    display: none;
  }
}

.row {
  margin: 0 -15px;

  @include respond-below(md) {
    margin: 0 -10px;
  }
}

[class*="col-"] {
  padding: 0 15px;

  @include respond-below(md) {
    padding: 0 10px;
  }
}
</style>
