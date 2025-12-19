// validation.js
$(function () {
  // helpers
  function isEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }
  function isDigits(val) {
    return /^\d+$/.test(val);
  }

  function showInvalid($el, msg) {
    // hide any legacy warning next to this field
    const $legacy = $el.siblings('.warningtext, .warningmsg, p.warningtext');
    $legacy.addClass('d-none');

    $el.removeClass('is-valid').addClass('is-invalid');
    let $fb = $el.next('.invalid-feedback');
    if (!$fb.length) {
      $fb = $('<div class="invalid-feedback"></div>').insertAfter($el);
    }
    $fb.text(msg).show();
  }
  function showValid($el) {
    $el.removeClass('is-invalid').addClass('is-valid');
    const $fb = $el.next('.invalid-feedback');
    if ($fb.length) $fb.hide();
    // hide legacy warnings too
    $el.siblings('.warningtext, .warningmsg, p.warningtext').addClass('d-none');
  }
  function clearValidation($el) {
    $el.removeClass('is-invalid is-valid');
    const $fb = $el.next('.invalid-feedback');
    if ($fb.length) $fb.hide();
  }

  // Selectors for the forms that appear on your page
  const $emailArea = $('#emailmodified'); // "Continue with Email" form area
  const $signInArea = $('#modified');     // "Sign In" modal area (username/password)

  // Email form fields (these exist in your HTML)
  const $fname = $('#fname');
  const $lname = $('#lname');
  const $mail = $('#mail');
  const $passwd = $('#password');

  // Sign-in fields (these inputs in #modified have no IDs; we target their first text/password)
  const $modUsername = $signInArea.find('input[type="text"]').first();
  const $modPassword = $signInArea.find('input[type="password"]').first();

  // Live handlers: remove invalid state as user types / blurs
  [$fname, $lname, $mail, $passwd, $modUsername, $modPassword].forEach(($el) => {
    if (!$el || !$el.length) return;
    $el.on('input blur', function () {
      // small validation while typing: if non-empty remove invalid, email pattern for email field
      const id = $el.attr('id') || '';
      const val = $el.val().trim();
      if (!val) {
        // keep invalid if empty; but hide legacy warnings so bootstrap feedback takes over when needed
        clearValidation($el);
        return;
      }
      if (id === 'mail') {
        if (isEmail(val)) showValid($el); else showInvalid($el, 'Enter a valid email address.');
      } else {
        showValid($el);
      }
    });
  });

  // Validation functions for each visible form
  function validateEmailForm() {
    let ok = true;

    // first name
    if (!$fname.length || !$fname.val().trim()) {
      showInvalid($fname, 'First name is required.');
      ok = false;
    } else if ($fname.val().trim().length < 2) {
      showInvalid($fname, 'Enter at least 2 characters.');
      ok = false;
    } else showValid($fname);

    // last name
    if (!$lname.length || !$lname.val().trim()) {
      showInvalid($lname, 'Last name is required.');
      ok = false;
    } else if ($lname.val().trim().length < 2) {
      showInvalid($lname, 'Enter at least 2 characters.');
      ok = false;
    } else showValid($lname);

    // email
    if (!$mail.length || !$mail.val().trim()) {
      showInvalid($mail, 'Email is required.');
      ok = false;
    } else if (!isEmail($mail.val().trim())) {
      showInvalid($mail, 'Enter a valid email address.');
      ok = false;
    } else showValid($mail);

    // password
    if (!$passwd.length || !$passwd.val().trim()) {
      showInvalid($passwd, 'Password is required.');
      ok = false;
    } else if ($passwd.val().trim().length < 6) {
      showInvalid($passwd, 'Password must be at least 6 characters.');
      ok = false;
    } else showValid($passwd);

    return ok;
  }

  function validateSignInForm() {
    let ok = true;
    if (!$modUsername.length || !$modUsername.val().trim()) {
      showInvalid($modUsername, 'Username or email is required.');
      ok = false;
    } else showValid($modUsername);

    if (!$modPassword.length || !$modPassword.val().trim()) {
      showInvalid($modPassword, 'Password is required.');
      ok = false;
    } else showValid($modPassword);

    // if username looks like an email, give format hint (optional)
    const usernameVal = $modUsername.val() ? $modUsername.val().trim() : '';
    if (usernameVal && usernameVal.includes('@') && !isEmail(usernameVal)) {
      showInvalid($modUsername, 'Enter a valid email address or plain username.');
      ok = false;
    }

    return ok;
  }

  // Handler for the green "Create account and Continue" button
  const $continueBtn = $('.btn-success').first(); // your page has that green button
  if ($continueBtn && $continueBtn.length) {
    $continueBtn.on('click', function (e) {
      // Determine which block is visible: email form or sign-in form (or neither)
      e.preventDefault();

      // Clear previous bootstrap validation (so messages are updated)
      [$fname, $lname, $mail, $passwd, $modUsername, $modPassword].forEach(($el) => {
        if (!$el || !$el.length) return;
        clearValidation($el);
      });

      const emailVisible = $emailArea.is(':visible');
      const signInVisible = $signInArea.is(':visible');

      let ok = true;
      let $firstInvalid = null;

      if (emailVisible) {
        ok = validateEmailForm();
        if (!ok) $firstInvalid = $('.is-invalid:first');
      } else if (signInVisible) {
        ok = validateSignInForm();
        if (!ok) $firstInvalid = $('.is-invalid:first');
      } else {
        // no visible form: nothing to validate; allow default behaviour (or show a small notice)
        ok = true;
      }

      if (!ok) {
        // smooth scroll to first invalid
        if (!$firstInvalid || !$firstInvalid.length) $firstInvalid = $('.is-invalid:first');
        if ($firstInvalid && $firstInvalid.length) {
          $('html, body').animate(
            { scrollTop: Math.max(0, $firstInvalid.offset().top - 100) },
            300,
            function () {
              $firstInvalid.focus();
            }
          );
        }
        return false; // prevent further action
      }

      // All good: you can proceed. For now show a simple message (replace with actual submit/navigation)
      alert('All fields look good — continuing.');
      // If you want to navigate to billingdetails after success:
      // window.location.href = "billingdetails.html";
      return true;
    });
  }

  // Also support pressing Enter inside any visible input: validate that form
  $(document).on('keypress', 'input', function (e) {
    if (e.which === 13) { // Enter key
      const $input = $(this);
      // only handle if it is inside one of our areas
      if ($input.closest('#emailmodified').length || $input.closest('#modified').length) {
        e.preventDefault();
        $continueBtn.trigger('click');
      }
    }
  });
});
