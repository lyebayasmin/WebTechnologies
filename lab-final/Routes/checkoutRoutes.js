// routes/checkoutRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // create this model file or adjust path
const { checkCartNotEmpty } = require("../middleware");

// Checkout page
router.get("/", checkCartNotEmpty, (req, res) => {
  const cart = req.session.cart;
  let totalAmount = 0;
  cart.forEach(item => totalAmount += item.price * item.quantity);
  res.render("pages/checkout", { title: "Checkout", cart, totalAmount });
});

// Submit order
router.post("/", checkCartNotEmpty, async (req, res) => {
  try {
    const { customerName, email } = req.body;
    const cart = req.session.cart;

    let totalAmount = 0;
    const items = cart.map(item => {
      totalAmount += item.price * item.quantity;
      return {
        product: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      };
    });

    const order = new Order({ customerName, email, items, totalAmount });
    await order.save();

    req.session.cart = []; // clear cart
    res.redirect(`/order-confirmation/${order._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Order Failed");
  }
});

module.exports = router;
