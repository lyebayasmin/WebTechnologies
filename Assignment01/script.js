document.addEventListener("DOMContentLoaded", function () {
  const debug = (...args) => console.log("[site-script]", ...args);

  // Helper: find element by exact text (case-insensitive, trimmed)
  const findByText = (selector, text) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    return nodes.find(
      (el) =>
        el.textContent &&
        el.textContent.trim().toLowerCase() === text.trim().toLowerCase()
    );
  };

  // Helper: find any element (a/button) whose text contains a phrase (loose match)
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
          debug("Buy now clicked → checkout.html");
          window.location.href = "checkout.html";
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
        debug("Add to Cart clicked → checkout2.html");
        window.location.href = "checkout2.html";
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
        debug("Go to Checkout clicked → checkout3.html");
        window.location.href = "checkout3.html";
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
        debug("Keep Browsing clicked → checkout.html");
        window.location.href = "checkout.html";
      });
    } else {
      debug("No 'Keep Browsing' button found on this page.");
    }
  } catch (err) {
    debug("Error attaching Keep Browsing handler:", err);
  }

  // ===== CHECKOUT3 PAGE: "Back" button handler (optional) =====
  try {
    const backToCartBtn =
      document.querySelector("[data-target='checkout2-back']") ||
      findByTextLoose("back to cart") ||
      findByTextLoose("previous");
    if (backToCartBtn) {
      backToCartBtn.addEventListener("click", function (e) {
        e.preventDefault();
        debug("Back button clicked → checkout2.html");
        window.location.href = "checkout2.html";
      });
    }
  } catch (err) {
    debug("Error attaching Back button handler:", err);
  }

  // ===== CHECKOUT3 PAGE: SIGN IN / CREATE ACCOUNT TOGGLE =====
  try {
    const signInBtn = document.getElementById("signInBtn");
    const createAccountBtn = document.getElementById("createAccountBtn");
    const original = document.getElementById("original");
    const modified = document.getElementById("modified");
    const originalPara = document.getElementById("originalPara");
    const modifiedPara = document.getElementById("modifiedPara");

    if (signInBtn && createAccountBtn && original && modified && originalPara && modifiedPara) {
      // When "Sign In" is clicked → show modified divs, hide original ones
      signInBtn.addEventListener("click", function () {
        original.classList.add("d-none");
        originalPara.classList.add("d-none");
        modified.classList.remove("d-none");
        modifiedPara.classList.remove("d-none");
        debug("Switched to Sign In view");
      });

      // When "Create Account" is clicked → go back
      createAccountBtn.addEventListener("click", function () {
        modified.classList.add("d-none");
        modifiedPara.classList.add("d-none");
        original.classList.remove("d-none");
        originalPara.classList.remove("d-none");
        debug("Switched back to Create Account view");
      });
    } else {
      debug("Sign In / Create Account elements not found on this page.");
    }
  } catch (err) {
    debug("Error attaching Sign In / Create Account toggle:", err);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const emailBtn = document.querySelector("#original button.btn-light.w-100.fw-bold.text-muted.mb-4"); 
  const emailModified = document.getElementById("emailmodified");
  const originalLogos = document.getElementById("originallogobuttons");
  const originalSection = document.getElementById("original");

  if (emailBtn) {
    emailBtn.addEventListener("click", function () {
      // Hide logo buttons (Google, Apple, Facebook)
      originalLogos.classList.add("d-none");
      
      // Hide the "Continue with Email" section
      originalSection.classList.add("d-none");
      
      // Show email form section
      emailModified.classList.remove("d-none");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const remindMeBtn = document.querySelector("#button");

  if (remindMeBtn) {
    remindMeBtn.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior
      window.location.href = "username.html"; // Redirect to username.html
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // "Remind me" button (assuming it still has id="button")
  const remindMeBtn = document.querySelector("#button");
  if (remindMeBtn) {
    remindMeBtn.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "username.html";
    });
  }

  // "Forgot" button
  const forgotBtn = document.querySelector("#buttonforgot");
  if (forgotBtn) {
    forgotBtn.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "password.html";
    });
  }
});


// moving to billing details page

document.addEventListener("DOMContentLoaded", function() {
  // Select the Billing Details button
  const billingBtn = document.querySelector(".btn.btn-light.fs-4.text-muted.fw-bold");

  if (billingBtn) {
    billingBtn.addEventListener("click", function() {
      // Navigate to billingdetails.html
      window.location.href = "billingdetails.html";
    });
  }
});

// to show dropdown

document.addEventListener("DOMContentLoaded", function() {
  // Select the lines div and dropdown list
  const lines = document.querySelector(".lines");
  const dropdownList = document.querySelector(".dropdown ul");

  // When lines div is clicked
  lines.addEventListener("click", function() {
    // Toggle dropdown visibility
    if (dropdownList.style.display === "block") {
      dropdownList.style.display = "none";
    } else {
      dropdownList.style.display = "block";
    }
  });
});

// for payment method
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveBilling");
  const openPaymentBtn = document.getElementById("openPayment");
  const paymentSection = document.getElementById("paymentSection");
  const termsCheck = document.getElementById("termsCheck");
  const placeBtn = document.getElementById("placeBtn");

  let billingSaved = false;

  //  Save Billing Info
  saveBtn.addEventListener("click", () => {
    billingSaved = true;
    alert(" Billing info saved!");
  });

  //  Open Payment Section
  openPaymentBtn.addEventListener("click", () => {
    if (!billingSaved) {
      alert("Please save billing info first!");
      return;
    }
    paymentSection.classList.remove("d-none");
    paymentSection.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  //  Enable Place Order only when checkbox checked
  termsCheck.addEventListener("change", () => {
    placeBtn.disabled = !termsCheck.checked;
  });

  //  Place Order
  placeBtn.addEventListener("click", () => {
    alert(" Order placed successfully!");
  });
});

// review button

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const saveBtn = document.getElementById("saveBilling");
  const openPaymentBtn = document.getElementById("openPayment");
  const paymentSection = document.getElementById("paymentSection");
  const reviewBtn = document.getElementById("reviewBtn");
  const placeBtn = document.getElementById("placeBtn");
  const termsCheck = document.getElementById("termsCheck");

  const orderSummary = document.getElementById("ordersummary");
  const osItems = document.getElementById("os-items");
  const osHandling = document.getElementById("os-handling");
  const osTotal = document.getElementById("os-total");
  const osBilling = document.getElementById("os-billing");
  const osPayment = document.getElementById("os-payment");

  // Example ordered items (you can replace these with dynamic data later)
  const orderedItems = [
    { name: "Betheme | Responsive Multipurpose WordPress", qty: 1, price: 60.0 }
  ];
  const handlingFee = 0.0;

  let billingSaved = false;

  // Helper: get the billing container (the main left column)
  function getBillingContainer() {
    // pick the first .d-flex.flex-column.col-6 (matches your layout)
    return document.querySelector(".d-flex.flex-column.col-6");
  }

  // Helper: get visible text inputs in a container
  function getVisibleTextInputs(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea'))
      .filter(i => i.offsetParent !== null && !i.disabled);
  }

  // Validate billing inputs; mark invalid fields with bootstrap class
  function validateBilling() {
    const billing = getBillingContainer();
    const inputs = getVisibleTextInputs(billing);
    let allFilled = true;

    inputs.forEach(input => {
      if ((input.value || "").trim() === "") {
        input.classList.add("is-invalid");
        allFilled = false;
      } else {
        input.classList.remove("is-invalid");
      }
    });

    if (!allFilled) {
      // focus first empty
      const firstEmpty = inputs.find(i => (i.value || "").trim() === "");
      if (firstEmpty) firstEmpty.focus();
    }
    return allFilled;
  }

  // Validate payment inputs when Card is selected
  function validatePaymentFields() {
    // check which payment is selected
    const paySelected = document.querySelector('input[name="pay"]:checked');
    if (!paySelected) {
      alert("⚠️ Please select a payment method.");
      return false;
    }

    if (paySelected.value === "card") {
      // require cardholder, card number, expiry, cvv (visible inputs)
      const cardName = paymentSection.querySelector('input[placeholder="Full name as on card"], input[placeholder="full name as on card"], input[placeholder^="Full name"]');
      const cardNum = paymentSection.querySelector('input[placeholder="1234 5678"], input[placeholder^="1234"]');
      const expiry = paymentSection.querySelector('input[placeholder="MM/YY"]');
      const cvv = paymentSection.querySelector('input[placeholder="123"]');

      const fields = [cardName, cardNum, expiry, cvv].filter(Boolean);
      let allFilled = true;
      fields.forEach(f => {
        if ((f.value || "").trim() === "") {
          f.classList.add("is-invalid");
          allFilled = false;
        } else {
          f.classList.remove("is-invalid");
        }
      });
      if (!allFilled) {
        const firstEmpty = fields.find(f => (f.value || "").trim() === "");
        if (firstEmpty) firstEmpty.focus();
        alert("⚠️ Please fill all card details before reviewing.");
        return false;
      }
    } else {
      // For COD or Wallet we won't require card fields
    }
    return true;
  }

  // Show payment section (called after billing saved)
  function showPaymentSection() {
    if (!paymentSection) return;
    paymentSection.classList.remove("d-none");
    paymentSection.style.display = paymentSection.style.display || "block";
    paymentSection.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Build and fill order summary HTML inside the existing orderSummary placeholders
  function populateOrderSummary() {
    // Items
    osItems.innerHTML = "";
    orderedItems.forEach(item => {
      const row = document.createElement("div");
      row.className = "d-flex justify-content-between mb-1";
      row.innerHTML = `<div class="text-secondary small">${item.name} x${item.qty}</div><div class="small">$${(item.price * item.qty).toFixed(2)}</div>`;
      osItems.appendChild(row);
    });

    // Handling and total
    osHandling.textContent = `$${handlingFee.toFixed(2)}`;
    const total = orderedItems.reduce((s, it) => s + it.qty * it.price, 0) + handlingFee;
    osTotal.textContent = `US $${total.toFixed(2)}`;

    // Billing summary (gathers values from visible billing inputs)
    const billing = getBillingContainer();
    const fields = [
      { label: "Name", selector: 'input[placeholder], input' } // fallback to show some info
    ];

    // We'll try to pick key billing fields individually if present
    const firstName = billing.querySelector('input[placeholder="First name"], input.form-control') ||
                      billing.querySelector('input:not([type])');
    // Simpler: collect label+value pairs by traversing labels in billing container
    const labels = Array.from(billing.querySelectorAll('label, .fw-bold')).slice(0, 10);
    const inputs = Array.from(billing.querySelectorAll('input.form-control, input[type="text"], textarea, select')).slice(0, 20);

    // Create a small billing summary (first name, last name, country, address)
    const name1 = billing.querySelector('.d-flex.gap-3 .flex-fill input') && billing.querySelector('.d-flex.gap-3 .flex-fill input').value;
    const name2 = billing.querySelectorAll('.d-flex.gap-3 .flex-fill input')[1] && billing.querySelectorAll('.d-flex.gap-3 .flex-fill input')[1].value;
    const country = Array.from(billing.querySelectorAll('input')).find((_, i) => i === 2) ? billing.querySelectorAll('input')[2].value : "";
    const address1 = Array.from(billing.querySelectorAll('input'))[3] ? billing.querySelectorAll('input')[3].value : "";
    const city = Array.from(billing.querySelectorAll('input'))[6] ? billing.querySelectorAll('input')[6].value : "";

    osBilling.innerHTML = `
      <div class="small text-secondary">Billing</div>
      <div class="small">${(name1||"") + (name2? " " + name2 : "")}</div>
      <div class="small">${address1 || ""}</div>
      <div class="small">${city || ""} ${country || ""}</div>
    `;

    // Payment summary
    const selectedPay = document.querySelector('input[name="pay"]:checked');
    const pmethod = selectedPay ? selectedPay.value.toUpperCase() : "N/A";
    let paymentHtml = `<div class="small text-secondary">Payment</div><div class="small">${pmethod}</div>`;

    if (selectedPay && selectedPay.value === "card") {
      const cardName = paymentSection.querySelector('input[placeholder="Full name as on card"], input[placeholder="full name as on card"]');
      const cardNum = paymentSection.querySelector('input[placeholder="1234 5678"], input[placeholder^="1234"]');
      const expiry = paymentSection.querySelector('input[placeholder="MM/YY"]');

      const masked = cardNum && cardNum.value ? maskCardNumber(cardNum.value) : "N/A";
      paymentHtml += `<div class="small">${cardName ? cardName.value : "N/A"}</div>`;
      paymentHtml += `<div class="small">${masked}</div>`;
      paymentHtml += `<div class="small">Expiry: ${expiry ? expiry.value : "N/A"}</div>`;
    }

    osPayment.innerHTML = paymentHtml;
  }

  // Mask card number (show last 4)
  function maskCardNumber(s) {
    const digits = s.replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    return "•••• •••• •••• " + digits.slice(-4);
  }

  // === Event listeners ===

  // Save billing: validate all billing fields are filled
  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const ok = validateBilling();
      if (!ok) {
        alert("⚠️ Please fill all billing details before continuing.");
        billingSaved = false;
        return;
      }
      billingSaved = true;
     
    });
  }

  // Open payment: only if billing saved
  if (openPaymentBtn) {
    openPaymentBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!billingSaved) {
        alert("⚠️ Please save your billing information first.");
        return;
      }
      showPaymentSection();
    });
  }

  // Review: validate payment (if needed) and show ordersummary (populate)
  if (reviewBtn) {
    reviewBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // require payment selected and payment fields valid (if card)
      const payChosen = document.querySelector('input[name="pay"]:checked');
      if (!payChosen) {
        alert("⚠️ Please select a payment method before reviewing.");
        return;
      }

      if (!validatePaymentFields()) {
        return;
      }

      // populate summary and show it
      populateOrderSummary();
      if (orderSummary) {
        orderSummary.classList.remove("d-none");
        orderSummary.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  // Enable Place only when terms checked
  if (termsCheck && placeBtn) {
    termsCheck.addEventListener("change", () => {
      placeBtn.disabled = !termsCheck.checked;
    });
  }

  // Place order: basic checks then success alert
  if (placeBtn) {
    placeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!billingSaved) {
        alert("⚠️ Please save billing first.");
        return;
      }
      const payChosen = document.querySelector('input[name="pay"]:checked');
      if (!payChosen) {
        alert("⚠️ Please select a payment method.");
        return;
      }
      if (!termsCheck.checked) {
        alert("⚠️ Please accept the Terms and Conditions.");
        return;
      }
     
      // optional: you can hide order summary or reset the form here
    });
  }

});
