const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// --------------------
// Admin Dashboard
// --------------------
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard', { title: "Dashboard" });
});

// --------------------
// Product List
// --------------------
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/ProductList', { title: "Products", products });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// --------------------
// Add Product
// --------------------
router.get('/products/add', (req, res) => {
    res.render('admin/addproduct', { title: "Add Product" });
});

router.post('/products/add', async (req, res) => {
    try {
        const { name, price, category, description, image } = req.body;
        const product = new Product({ name, price, category, description, image });
        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// --------------------
// Edit Product
// --------------------
router.get('/products/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found");
        res.render('admin/editproduct', { title: "Edit Product", product });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.post('/products/edit/:id', async (req, res) => {
    try {
        const { name, price, category, description, image } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { name, price, category, description, image });
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// --------------------
// Delete Product
// --------------------
router.post('/products/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
