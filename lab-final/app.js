const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

// ----- MIDDLEWARE FUNCTIONS -----

// Middleware to ensure the cart is not empty before checkout
// Prevents users from accessing checkout page with an empty cart
const checkCartNotEmpty = (req, res, next) => {
  const cart = req.session.cart || [];
  if (cart.length === 0) return res.redirect("/cart");
  next();
};

// Middleware to allow only admin users to access certain routes
// Checks if the query email matches the admin email
const adminOnly = (req, res, next) => {
  const email = req.query.email || "";
  if (email !== "admin@shop.com") return res.status(403).send("Access Denied: Admins Only");
  next();
};

// ----- MIDDLEWARE SETUP -----
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded POST form data

// ----- SESSION SETUP -----
// Session stores temporary data for each user (like cart)
app.use(
  session({
    secret: "labfinalsecret",
    resave: false,
    saveUninitialized: true,
  })
);

// ----- EJS SETUP -----
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ----- MONGOOSE SETUP -----
mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerceDB")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ----- PRODUCT MODEL -----
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: String,
  description: String,
});
const Product = mongoose.model("Product", productSchema);

// ----- ORDER MODEL -----
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // reference to product
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

// ----- MAIN SITE ROUTES -----

// Home page
app.get("/", (req, res) => res.render("pages/home", { title: "Home" }));

// Products page with pagination and filters
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

    // Render products with pagination info
    res.render("pages/products", {
      title: "Products",
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      categoryFilter,
      priceMin,
      priceMax,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ----- CART ROUTES -----

// Add product to cart
app.get("/add-to-cart/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect("/products");

    if (!req.session.cart) req.session.cart = [];
    const cart = req.session.cart;

    // Check if product is already in cart
    const existingItem = cart.find((item) => item.productId == product._id);
    if (existingItem) existingItem.quantity += 1; // increment quantity
    else
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });

    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.redirect("/products");
  }
});

// Display cart page
app.get("/cart", async (req, res) => {
  if (!req.session.cart) req.session.cart = [];
  const updatedCart = [];
  let totalAmount = 0;

  // Recalculate cart total and remove deleted products
  for (let item of req.session.cart) {
    const product = await Product.findById(item.productId);
    if (product) {
      updatedCart.push(item);
      totalAmount += item.price * item.quantity;
    }
  }

  req.session.cart = updatedCart;
  res.render("pages/cart", { title: "Cart", cart: updatedCart, totalAmount });
});

// ----- CHECKOUT & ORDER -----

// Display checkout page
app.get("/checkout", checkCartNotEmpty, async (req, res) => {
  const updatedCart = [];
  let totalAmount = 0;

  for (let item of req.session.cart) {
    const product = await Product.findById(item.productId);
    if (product) {
      updatedCart.push(item);
      totalAmount += item.price * item.quantity;
    }
  }

  if (updatedCart.length === 0) {
    req.session.cart = [];
    return res.redirect("/cart");
  }

  req.session.cart = updatedCart;
  res.render("pages/checkout", { title: "Checkout", cart: updatedCart, totalAmount });
});

// Process checkout and create order
app.post("/checkout", checkCartNotEmpty, async (req, res) => {
  try {
    const { customerName, email } = req.body;

    // Validate inputs
    if (!customerName || !email) return res.status(400).send("Name and Email required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).send("Invalid Email");

    const updatedCart = [];
    let totalAmount = 0;
    for (let item of req.session.cart) {
      const product = await Product.findById(item.productId);
      if (product) {
        updatedCart.push(item);
        totalAmount += item.price * item.quantity;
      }
    }

    if (updatedCart.length === 0) {
      req.session.cart = [];
      return res.redirect("/cart");
    }

    // Map cart items for order
    const items = updatedCart.map((item) => ({
      product: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    // Save order to DB
    const order = new Order({ customerName, email, items, totalAmount });
    await order.save();

    // Clear cart after order
    req.session.cart = [];
    res.redirect(`/order-confirmation/${order._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Order Failed");
  }
});

// Order confirmation page
app.get("/order-confirmation/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send("Order not found");
  res.render("pages/orderConfirmation", { title: "Order Confirmed", order });
});

// ----- ADMIN PANEL ROUTES -----
const adminRouter = express.Router();
adminRouter.use(adminOnly); // Protect all admin routes

// Admin Dashboard
adminRouter.get("/dashboard", (req, res) =>
  res.render("admin/dashboard", { title: "Admin Dashboard" })
);

// Admin Products
adminRouter.get("/products", async (req, res) => {
  const products = await Product.find();
  res.render("admin/ProductList", { title: "Products", products });
});

// Add product
adminRouter.get("/products/add", (req, res) => res.render("admin/addproduct", { title: "Add Product" }));
adminRouter.post("/products/add", async (req, res) => {
  const { name, price, category, description, image } = req.body;
  const product = new Product({ name, price, category, description, image });
  await product.save();
  res.redirect("/admin/products");
});

// Edit product
adminRouter.get("/products/edit/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/editproduct", { title: "Edit Product", product });
});
adminRouter.post("/products/edit/:id", async (req, res) => {
  const { name, price, category, description, image } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, price, category, description, image });
  res.redirect("/admin/products");
});

// Delete product
adminRouter.post("/products/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/admin/products");
});

// Admin Orders Dashboard
adminRouter.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.render("admin/orders", { title: "Admin Orders", orders });
});

// Confirm or Cancel orders
adminRouter.post("/orders/:id/confirm", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: "Confirmed" });
  res.redirect("/admin/orders");
});
adminRouter.post("/orders/:id/cancel", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: "Cancelled" });
  res.redirect("/admin/orders");
});

app.use("/admin", adminRouter);

// ----- 404 PAGE -----
app.use((req, res) => res.status(404).send("404 - Page Not Found"));

// ----- SERVER -----
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
