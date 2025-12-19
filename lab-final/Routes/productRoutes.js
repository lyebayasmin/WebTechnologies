// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /products?page=1&limit=10&category=Ice Cream&minPrice=0&maxPrice=100
router.get("/", async (req, res) => {
  try {
    // Pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    // Filters
    const categoryFilter = req.query.category || "";
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Number.MAX_SAFE_INTEGER;

    // Build MongoDB filter object
    let filter = {};

    // Category filter
    if (categoryFilter) {
      filter.category = categoryFilter;
    }

    // Price filter
    if (minPrice || maxPrice !== Number.MAX_SAFE_INTEGER) {
      filter.price = {
        $gte: minPrice,
        $lte: maxPrice
      };
    }

    // Count total products (important for pagination)
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    // Fetch products
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit);

    // Render page
    res.render("pages/products", {
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      categoryFilter,
      minPrice,
      maxPrice
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
