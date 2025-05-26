const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
const upload = multer({ dest: "uploads/" });

const dataDir = path.join(__dirname, "data");
const dataFilePath = path.join(dataDir, "product.json");
 
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
 
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, "[]", "utf8");
}

// GET all products
app.get("/api/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  res.json(products);
});

// POST a new product
app.post("/api/products", upload.none(), (req, res) => {
  const product = req.body;
  const products = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  product.id = Date.now();
  product.price = Number(product.price);  
  product.stock = Number(product.stock);  
  products.push(product);

  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), "utf8");
  res.json({ success: true, message: "Product saved successfully", product });
});
 
app.put("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const updatedProduct = req.body;
  let products = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  products[productIndex] = {
    ...products[productIndex],
    ...updatedProduct,
    price: Number(updatedProduct.price),  
    stock: Number(updatedProduct.stock),  
  };

  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), "utf8");
  res.json({ success: true, message: "Product updated successfully", product: products[productIndex] });
});

// DELETE a product
app.delete("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  let products = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  products = products.filter((p) => p.id !== productId);
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), "utf8");
  res.json({ success: true, message: "Product deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});