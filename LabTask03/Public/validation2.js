document.addEventListener("DOMContentLoaded", function () {

  const saveBtn = document.getElementById("saveBilling");
  const paymentSection = document.getElementById("paymentSection");
  const reviewBtn = document.getElementById("reviewBtn");
  const placeBtn = document.getElementById("placeBtn");
  const termsCheck = document.getElementById("termsCheck");
  const orderSummary = document.getElementById("ordersummary");

  // Collect all billing inputs (excluding payment section)
  const billingInputs = Array.from(document.querySelectorAll("div.d-flex.flex-column.col-6 input")).filter(
    input => !input.closest("#paymentSection")
  );

  // Check if billing fields are filled
  function checkFields() {
    let valid = true;
    billingInputs.forEach(input => {
      if (input.value.trim() === "") {
        valid = false;
        input.classList.add("is-invalid");
      } else {
        input.classList.remove("is-invalid");
      }
    });
    return valid;
  }

  // Save and Continue button
  saveBtn?.addEventListener("click", function () {
    if (checkFields()) {
      alert("All billing fields filled successfully!");
      paymentSection.classList.remove("d-none");
      paymentSection.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Please fill all required billing fields!");
    }
  });

  // Enable Place Order when terms accepted
  termsCheck?.addEventListener("change", function () {
    placeBtn.disabled = !this.checked;
  });

  // Show Order Summary
  reviewBtn?.addEventListener("click", function () {
    if (orderSummary) {
      orderSummary.classList.remove("d-none");
      orderSummary.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Place Order alert
  placeBtn?.addEventListener("click", function () {
    // Optional: check payment inputs if card selected
    const selectedPay = document.querySelector('input[name="pay"]:checked');
    if (!selectedPay) {
      alert("Please select a payment method before placing the order!");
      return;
    }

    if (selectedPay.value === "card") {
      const cardInputs = Array.from(paymentSection.querySelectorAll('input[placeholder]'));
      const emptyCardField = cardInputs.find(input => input.value.trim() === "");
      if (emptyCardField) {
        alert("Please fill all card details before placing the order!");
        return;
      }
    }

    alert("Order placed successfully!");
  });

});
