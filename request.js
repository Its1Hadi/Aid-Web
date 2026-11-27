const form = document.getElementById("Help");
const feedback = document.getElementById("feedback");
const statusInput = document.getElementById("status");
const fullName = document.getElementById("fullname");
const phone = document.getElementById("phone");
const locationBox = document.getElementById("location");
const contact = document.getElementById("contact");
const details = document.getElementById("details");
const locating = document.getElementById("locating");

const statusLinks = document.querySelectorAll(".Status a");
const statusCards = document.querySelectorAll(".Status");
const chips = document.querySelectorAll(".Chips button");

function showMessage(text, type) {
    feedback.textContent = text;
    feedback.className = "feedback " + type;
}

for (const link of statusLinks) {
    link.addEventListener("click", function () {

        for (const card of statusCards) {
            card.classList.remove("selected");
        }

        link.parentElement.classList.add("selected");

        statusInput.value = link.dataset.status;
    });
}

for (const chip of chips) {
    chip.addEventListener("click", function () {
        const symptom = chip.firstChild.textContent.trim();

        if (details.value.includes(symptom)) {
            return;
        }

        if (details.value === "") {
            details.value = symptom;
        } else {
            details.value = details.value + ", " + symptom;
        }
    });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            locationBox.value = position.coords.latitude + ", " + position.coords.longitude;
            locating.textContent = "Location found.";
        },
        
        function () {
            locating.textContent = "Could not find your location. Please type it.";
        }
    );
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (statusInput.value === "") {
        showMessage("Please select your urgency status.", "error");
        return;
    }

    if (fullName.value.trim() === "") {
        showMessage("Please enter your full name.", "error");
        fullName.focus();
        return;
    }

    if (phone.value.trim() === "") {
        showMessage("Please enter your phone number.", "error");
        phone.focus();
        return;
    }

    if (locationBox.value.trim() === "") {
        showMessage("Please enter your location.", "error");
        locationBox.focus();
        return;
    }

    if (contact.value.trim() === "") {
        showMessage("Please enter an emergency contact.", "error");
        contact.focus();
        return;
    }

    if (details.value.trim() === "") {
        showMessage("Please describe what is happening.", "error");
        details.focus();
        return;
    }

    showMessage("Request sent (" + statusInput.value + "). Help is on the way.", "success");

    form.reset();
    statusInput.value = "";
    for (const card of statusCards) {
        card.classList.remove("selected");
    }
});