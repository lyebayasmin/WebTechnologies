const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// ----- MIDDLEWARE -----
app.use(express.static(path.join(__dirname, "public"))); // static files
app.use(express.urlencoded({ extended: true })); // parse POST form data

// ----- EJS SETUP -----
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ----- MONGOOSE SETUP -----
mongoose.connect("mongodb://127.0.0.1:27017/ecommerceDB")
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("MongoDB connection error:", err));

// ----- PRODUCT MODEL -----
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: String,
  description: String
});
const Product = mongoose.model("Product", productSchema);

// ----- MAIN SITE ROUTES -----
app.get("/", (req, res) => res.render("pages/home", { title: "Home" }));

app.get("/products", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const categoryFilter = req.query.category || "";
    const priceMin = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const priceMax = req.query.maxPrice ? Number(req.query.maxPrice) : 100000;

    let filter = { price: { $gte: priceMin, $lte: priceMax } };
    if (categoryFilter) filter.category = categoryFilter;

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(filter).skip(skip).limit(limit);

    res.render("pages/products", {
      title: "Products",
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      categoryFilter,
      priceMin,
      priceMax
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Other pages
app.get("/cart", (req, res) => res.render("pages/cart", { title: "Cart" }));
app.get("/checkout1", (req, res) => res.render("pages/checkout1", { title: "Checkout 1" }));
app.get("/checkout2", (req, res) => res.render("pages/checkout2", { title: "Checkout 2" }));
app.get("/checkout3", (req, res) => res.render("pages/checkout3", { title: "Checkout 3" }));
app.get("/billingdetails", (req, res) => res.render("pages/billingdetails", { title: "Billing" }));
app.get("/username", (req, res) => res.render("pages/username", { title: "User" }));

// ----- ADMIN PANEL ROUTES -----
const adminRouter = express.Router();

// Dashboard
adminRouter.get("/dashboard", (req, res) => {
  res.render("admin/dashboard", { title: "Admin Dashboard" });
});

// Product List
adminRouter.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/ProductList", { title: "Products", products }); // matches ProductList.ejs
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Add Product
adminRouter.get("/products/add", (req, res) => {
  res.render("admin/addproduct", { title: "Add Product" }); // matches addproduct.ejs
});
adminRouter.post("/products/add", async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;
    const product = new Product({ name, price, category, description, image });
    await product.save();
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Edit Product
adminRouter.get("/products/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render("admin/editproduct", { title: "Edit Product", product }); // matches editproduct.ejs
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
adminRouter.post("/products/edit/:id", async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, category, description, image });
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Delete Product
adminRouter.post("/products/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Use admin routes
app.use("/admin", adminRouter);

// 404 PAGE
app.use((req, res) => res.status(404).send("404 - Page Not Found"));

// SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
