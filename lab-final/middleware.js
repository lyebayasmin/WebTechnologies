
// Check if cart is not empty before checkout
function checkCartNotEmpty(req, res, next) {
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.redirect("/cart"); // redirect to cart if empty
  }
  next(); // proceed if cart has items
}

// Check if user is admin
function adminOnly(req, res, next) {
  // For demo purposes, assume email is stored in session
  const userEmail = req.session.userEmail; 
  if (userEmail === "admin@shop.com") {
    return next(); // allow access
  }
  return res.status(403).send("Access Denied: Admins Only");
}

module.exports = {
  checkCartNotEmpty,
  adminOnly
};
