// server.js
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

app.post("/api/products", upload.none(), (req, res) => {
  const product = req.body;

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, "[]", "utf8");
  }

  const products = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  product.id = Date.now();
  product.price = Number(product.price); // Ensure price is number
  product.stock = Number(product.stock); // Ensure stock is number
  products.push(product);

  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), "utf8");

  res.json({ success: true, message: "Product saved successfully", product });
});

app.get("/api/products", (req, res) => {
  if (!fs.existsSync(dataFilePath)) {
    return res.json([]);
  }
  const products = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
