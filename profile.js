const form = document.getElementById("Health-Profile-Form");
const message = document.getElementById("Profile-Message");

const fullName = document.getElementById("Full-name");
const contactName = document.getElementById("Contact-name");
const phone = document.getElementById("Phone");
const contactPhone = document.getElementById("Contact-Phone");
const bloodType = document.getElementById("Blood-Type");
const conditions = document.getElementById("Conditions");
const allergies = document.getElementById("Allergies");
const medications = document.getElementById("Medications");

function showMessage(text, type) {
    message.textContent = text;
    message.className = "feedback " + type;
}

function isValidPhone(number) {
    // Remove spaces, so "050 123 4567" becomes "0501234567"
    number = number.replaceAll(" ", "");

    // It must start with 05
    if (!number.startsWith("05")) {
        return false;
    }

    // It must have exactly 10 characters
    if (number.length !== 10) {
        return false;
    }

    // It must be only numbers (isNaN means "is Not a Number")
    if (isNaN(number)) {
        return false;
    }

    return true;
}

form.addEventListener("submit", function (event) {
    // Stop the page from reloading
    event.preventDefault();

    // Check that the required text boxes are not empty
    if (fullName.value.trim() === "") {
        showMessage("Please enter your full name.", "error");
        fullName.focus();
        return;
    }

    if (contactName.value.trim() === "") {
        showMessage("Please enter the emergency contact name.", "error");
        contactName.focus();
        return;
    }

    // Check the phone numbers
    if (!isValidPhone(phone.value)) {
        showMessage("Phone number must look like 05X XXX XXXX.", "error");
        phone.focus();
        return;
    }

    if (!isValidPhone(contactPhone.value)) {
        showMessage("Emergency phone must look like 05X XXX XXXX.", "error");
        contactPhone.focus();
        return;
    }

    // Check that a blood type was chosen
    if (bloodType.value === "") {
        showMessage("Please select your blood type.", "error");
        bloodType.focus();
        return;
    }

    // Everything is correct, so save the data in the browser
    const profile = {
        fullName: fullName.value,
        contactName: contactName.value,
        phone: phone.value,
        contactPhone: contactPhone.value,
        bloodType: bloodType.value,
        conditions: conditions.value,
        allergies: allergies.value,
        medications: medications.value
    };

    showMessage("Profile saved successfully.", "success");
});

if (savedText !== null) {
    // Turn the saved text back into an object
    const saved = JSON.parse(savedText);

    fullName.value = saved.fullName;
    contactName.value = saved.contactName;
    phone.value = saved.phone;
    contactPhone.value = saved.contactPhone;
    bloodType.value = saved.bloodType;
    conditions.value = saved.conditions;
    allergies.value = saved.allergies;
    medications.value = saved.medications;
}