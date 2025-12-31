// 1. SELECTING ELEMENTS
// We select the form and key inputs so we can work with them.
const form = document.getElementById("mainForm");
const output = document.querySelector("output");

// Select specific inputs by ID
const firstNameInput = document.getElementById("fname");
const emailInput = document.getElementById("email");
const ageInput = document.getElementById("age");
const countrySelect = document.getElementById("country");

// 2. HELPER FUNCTIONS
// These functions help us avoid writing the same code over and over.

/**
 * Function to Show Error
 * This adds the red border and inserts a message below the input.
 */
function showError(inputElement, message) {
  // 1. Get the parent element (usually the form or div)
  const parent = inputElement.parentElement;

  // 2. Check if an error message already exists to avoid duplicates
  const existingError = parent.querySelector(".error-msg");
  if (existingError) {
    existingError.remove();
  }

  // 3. Create a new element for the message
  const errorSpan = document.createElement("span");
  errorSpan.innerText = message;
  errorSpan.className = "error-msg"; // Add CSS class for style

  // 4. Add the red border class to the input
  inputElement.classList.add("input-error");
  inputElement.classList.remove("input-success");

  // 5. Insert the error message right after the input field
  // Note: special check for radio/checkbox groups could go here,
  // but we'll keep it simple for now.
  if (inputElement.nextSibling) {
    parent.insertBefore(errorSpan, inputElement.nextSibling);
  } else {
    parent.appendChild(errorSpan);
  }
}

/**
 * Function to Clear Error
 * Removes the red border and the message.
 */
function clearError(inputElement) {
  const parent = inputElement.parentElement;

  // Remove the red border class
  inputElement.classList.remove("input-error");

  // Add green border class (optional, visual feedback)
  inputElement.classList.add("input-success");

  // Remove the error text if it exists
  const errorMsg = parent.querySelector(".error-msg");
  if (errorMsg) {
    errorMsg.remove();
  }
}

/**
 * Function to Validate a Single Field
 * Returns true if valid, false if invalid
 */
function validateField(input) {
  // Get the value and remove extra spaces
  const value = input.value.trim();

  // LOGIC: Check First Name
  if (input.id === "fname") {
    if (value === "") {
      showError(input, "First Name cannot be empty.");
      return false;
    } else if (value.length < 3) {
      showError(input, "First Name must be at least 3 characters.");
      return false;
    }
  }

  // LOGIC: Check Email (Using browser's built-in validator)
  if (input.type === "email") {
    if (!input.checkValidity()) {
      showError(
        input,
        "Please enter a valid email address (e.g., user@mail.com)."
      );
      return false;
    }
  }

  // LOGIC: Check Age
  if (input.id === "age") {
    // Convert string value to number
    const ageNum = Number(value);
    if (value === "") {
      // It's okay if empty? No, let's make it required logic for demo
      showError(input, "Age is required.");
      return false;
    }
    if (ageNum < 18) {
      showError(input, "You must be at least 18 years old.");
      return false;
    }
    if (ageNum > 90) {
      showError(input, "Age cannot be higher than 90.");
      return false;
    }
  }

  // LOGIC: Check Country Dropdown
  if (input.id === "country") {
    if (value === "") {
      showError(input, "Please select a country from the list.");
      return false;
    }
  }

  // If we passed all checks, clear any old errors and return true
  clearError(input);
  return true;
}

// 3. EVENT LISTENERS
// This tells the browser *when* to run our code.

// "blur" triggers when the user leaves an input field
firstNameInput.addEventListener("blur", () => {
  validateField(firstNameInput);
});

emailInput.addEventListener("blur", () => {
  validateField(emailInput);
});

ageInput.addEventListener("blur", () => {
  validateField(ageInput);
});

countrySelect.addEventListener("change", () => {
  validateField(countrySelect);
});

// "input" triggers immediately when the user types (to remove errors in real-time)
firstNameInput.addEventListener("input", () => {
  // Only clear error if the user is fixing it, don't validate fully yet
  if (firstNameInput.classList.contains("input-error")) {
    validateField(firstNameInput);
  }
});

// 4. FORM SUBMISSION
// The Final Check

form.addEventListener("submit", (event) => {
  // 1. Prevent the browser from sending the form to the server immediately
  event.preventDefault();

  output.innerText = "Checking for errors...";

  // 2. Validate all fields manually
  const isNameValid = validateField(firstNameInput);
  const isEmailValid = validateField(emailInput);
  const isAgeValid = validateField(ageInput);
  const isCountryValid = validateField(countrySelect);

  // 3. Check specific "required" logic for radio buttons (Gender)
  // Radio buttons are tricky because there are multiple inputs with the same name
  const genderSelected = document.querySelector('input[name="gender"]:checked');
  const genderContainer = document.querySelector(".inline-group"); // wrapper div

  let isGenderValid = true;
  if (!genderSelected) {
    // We create a custom error display for the group
    // Check if error already exists
    if (!genderContainer.querySelector(".error-msg")) {
      const errorSpan = document.createElement("span");
      errorSpan.innerText = "Please select a gender.";
      errorSpan.className = "error-msg";
      genderContainer.appendChild(errorSpan);
    }
    isGenderValid = false;
  } else {
    // Clear gender error
    const existingMsg = genderContainer.querySelector(".error-msg");
    if (existingMsg) existingMsg.remove();
  }

  // 4. Final Decision
  if (
    isNameValid &&
    isEmailValid &&
    isAgeValid &&
    isCountryValid &&
    isGenderValid
  ) {
    // SUCCESS!
    output.innerText = "All data is valid! Submitting form...";
    output.style.color = "green";

    // Simulating data preparation
    const data = new FormData(form);
    // Here you would normally do: form.submit();
    alert("Success! Form data is ready to send.");
  } else {
    // FAILURE!
    output.innerText = "Please fix the errors highlighted in red above.";
    output.style.color = "red";
  }
});
