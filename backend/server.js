const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup
const upload = multer({ dest: "uploads/" });

// Data paths
const dataDir = path.join(__dirname, "data");
const dataFilePath = path.join(dataDir, "product.json");
const defaultDataPath = path.join(dataDir, "default.json");

// Ensure data directory and default file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(defaultDataPath)) {
  fs.writeFileSync(defaultDataPath, "[]", "utf8");
}

// RESET product.json to default state on every server start
fs.copyFileSync(defaultDataPath, dataFilePath);

// Load products
function loadProducts() {
  try {
    return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  } catch {
    return [];
  }
}

// Save products
function saveProducts(products) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), "utf8");
  } catch (err) {
    throw new Error("Failed to save data file");
  }
}

// GET all products
app.get("/api/products", (req, res) => {
  const products = loadProducts();
  res.json(products);
});

// POST a new product
app.post("/api/products", upload.none(), (req, res) => {
  try {
    const product = req.body;
    const products = loadProducts();

    product.id = Date.now();
    product.price = Number(product.price);
    product.stock = Number(product.stock);
    products.push(product);

    saveProducts(products);
    res.json({ success: true, message: "Product saved successfully", product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update product
app.put("/api/products/:id", (req, res) => {
  try {
    const productId = Number(req.params.id);
    const updatedProduct = req.body;
    const products = loadProducts();

    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    products[index] = {
      ...products[index],
      ...updatedProduct,
      price: Number(updatedProduct.price),
      stock: Number(updatedProduct.stock),
    };

    saveProducts(products);
    res.json({ success: true, message: "Product updated successfully", product: products[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE product
app.delete("/api/products/:id", (req, res) => {
  try {
    const productId = Number(req.params.id);
    let products = loadProducts();

    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    products = products.filter((p) => p.id !== productId);
    saveProducts(products);

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Server is running!");
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
