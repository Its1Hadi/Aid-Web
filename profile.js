var profileForm = document.getElementById("Health-Profile-Form");
var fullName = document.getElementById("Full-name");
var profileMessage = document.getElementById("Profile-Message");

function showFeedback(message, type) {
    profileMessage.textContent = message;
    profileMessage.className = "feedback " + type;
}

profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (fullName.value.trim() === "") {
        showFeedback("Please enter your full name.", "error");
        fullName.focus();
        return;
    }

    showFeedback("Profile information entered.", "success");
});