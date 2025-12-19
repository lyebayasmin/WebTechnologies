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

  // ===== INDEX PAGE: "Buy Now" links =====
  try {
    const buyNowLinks = document.querySelectorAll("ul li a");
    buyNowLinks.forEach(function (a) {
      if (a.textContent && a.textContent.trim().toLowerCase() === "buy now") {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          debug("Buy now clicked → checkout");
          window.location.href = "/checkout";
        });
      }
    });
  } catch (err) {
    debug("Error attaching Buy Now handlers:", err);
  }

  // ===== CHECKOUT PAGE: "Add to Cart" button =====
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
    } else {
      debug("No Add to Cart element found on this page.");
    }
  } catch (err) {
    debug("Error attaching Add to Cart handler:", err);
  }

  // ===== CHECKOUT2 PAGE: "Go to Checkout" button =====
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
    } else {
      debug("No 'Go to Checkout' element found on this page.");
    }
  } catch (err) {
    debug("Error attaching Go to Checkout handler:", err);
  }

  // ===== CHECKOUT2 PAGE: "Keep Browsing" button =====
  try {
    let keepBrowsingBtn = document.querySelector("[data-target='checkout']");
    if (!keepBrowsingBtn)
      keepBrowsingBtn = findByText("button, a", "keep browsing");
    if (!keepBrowsingBtn)
      keepBrowsingBtn = findByTextLoose("keep browsing");

    if (keepBrowsingBtn) {
      keepBrowsingBtn.addEventListener("click", function (e) {
        e.preventDefault();
        debug("Keep Browsing clicked → checkout");
        window.location.href = "/checkout";
      });
    } else {
      debug("No 'Keep Browsing' button found on this page.");
    }
  } catch (err) {
    debug("Error attaching Keep Browsing handler:", err);
  }

  // ===== CHECKOUT3 PAGE: "Back" button handler =====
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

  // ===== REMAINING LOGIC =====
  // All other code (Sign In / Create Account, billing, payment, review, etc.)
  // can remain unchanged — it doesn't depend on the page file extension.
});
