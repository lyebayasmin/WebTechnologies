document.addEventListener("DOMContentLoaded", function () {
  const debug = (...args) => console.log("[site-script]", ...args);

  const findByText = (selector, text) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    return nodes.find(
      (el) =>
        el.textContent &&
        el.textContent.trim().toLowerCase() === text.trim().toLowerCase()
    );
  };

  const findByTextLoose = (text) => {
    const nodes = Array.from(document.querySelectorAll("a, button"));
    return nodes.find(
      (el) =>
        el.textContent &&
        el.textContent.trim().toLowerCase().includes(text.trim().toLowerCase())
    );
  };

  // ==============================
  // NAVBAR: ICE CREAM → PRODUCTS
  // ==============================
  try {
    const iceCreamLink =
      findByText("a", "ice cream") ||
      findByText("a", "ice creams") ||
      findByTextLoose("ice");

    if (iceCreamLink) {
      iceCreamLink.addEventListener("click", function (e) {
        e.preventDefault();
        debug("Ice Cream clicked → products page");
        window.location.href = "/products";
        // OR if you want category filter:
        // window.location.href = "/products?category=IceCream";
      });
    }
  } catch (err) {
    debug("Error attaching Ice Cream navbar handler:", err);
  }

  // ===== HOME PAGE: "Buy Now" =====
  try {
    const buyNowLinks = document.querySelectorAll("ul li a");
    buyNowLinks.forEach(function (a) {
      if (a.textContent && a.textContent.trim().toLowerCase() === "buy now") {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          debug("Buy now clicked → checkout1");
          window.location.href = "/checkout1";
        });
      }
    });
  } catch (err) {
    debug("Error attaching Buy Now handlers:", err);
  }

  // ===== CHECKOUT1: "Add to Cart" =====
  try {
    let addToCartBtn = document.querySelector("[data-target='checkout2']");
    if (!addToCartBtn) addToCartBtn = findByText("a, button", "add to cart");
    if (!addToCartBtn) addToCartBtn = findByTextLoose("add to cart");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function (e) {
        e.preventDefault();
        debug("Add to Cart clicked → checkout2");
        window.location.href = "/checkout2";
      });
    }
  } catch (err) {
    debug("Error attaching Add to Cart handler:", err);
  }

  // ===== CHECKOUT2: "Go to Checkout" =====
  try {
    let goToCheckoutBtn = document.querySelector("[data-target='checkout3']");
    if (!goToCheckoutBtn)
      goToCheckoutBtn = findByText("button, a", "go to checkout");
    if (!goToCheckoutBtn) goToCheckoutBtn = findByTextLoose("go to checkout");

    if (goToCheckoutBtn) {
      goToCheckoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        debug("Go to Checkout clicked → checkout3");
        window.location.href = "/checkout3";
      });
    }
  } catch (err) {
    debug("Error attaching Go to Checkout handler:", err);
  }

  // ===== CHECKOUT2: "Keep Browsing" =====
  try {
    let keepBrowsingBtn = document.querySelector("[data-target='checkout1']");
    if (!keepBrowsingBtn)
      keepBrowsingBtn = findByText("button, a", "keep browsing");
    if (!keepBrowsingBtn)
      keepBrowsingBtn = findByTextLoose("keep browsing");

    if (keepBrowsingBtn) {
      keepBrowsingBtn.addEventListener("click", function (e) {
        e.preventDefault();
        debug("Keep Browsing clicked → checkout1");
        window.location.href = "/checkout1";
      });
    }
  } catch (err) {
    debug("Error attaching Keep Browsing handler:", err);
  }

  // ===== CHECKOUT3: "Back to Cart" =====
  try {
    const backToCartBtn =
      document.querySelector("[data-target='checkout2-back']") ||
      findByTextLoose("back to cart") ||
      findByTextLoose("previous");

    if (backToCartBtn) {
      backToCartBtn.addEventListener("click", function (e) {
        e.preventDefault();
        debug("Back button clicked → checkout2");
        window.location.href = "/checkout2";
      });
    }
  } catch (err) {
    debug("Error attaching Back button handler:", err);
  }

  // ===== CHECKOUT3: "Billing Details" =====
  try {
    const billingBtn = document.getElementById("billingBtn");

    if (billingBtn) {
      billingBtn.addEventListener("click", function (e) {
        e.preventDefault();
        debug("Billing button clicked → billingdetails");
        window.location.href = "/billingdetails";
      });
    }
  } catch (err) {
    debug("Error attaching Billing button handler:", err);
  }
});
