const form = document.getElementById("recoveryForm");
const dateBox = document.getElementById("entryDate");
const symptomBox = document.getElementById("symptomInput");
const painBox = document.getElementById("painLevel");
const wellnessBox = document.getElementById("wellnessRange");
const notesBox = document.getElementById("recoveryNotes");
const painOutput = document.getElementById("painOutput");
const wellnessOutput = document.getElementById("wellnessOutput");
const formMessage = document.getElementById("formMessage");
const historyBody = document.getElementById("historyBody");
const ring = document.getElementById("ring");
const ringText = document.getElementById("ringText");

const aiForm = document.getElementById("aiForm");
const aiQuestion = document.getElementById("aiQuestion");
const aiAnswer = document.getElementById("aiAnswer");
const quickButtons = document.querySelectorAll(".Quick");
const locating = document.getElementById("locating");

// These show on the page the first time, before the user adds anything
const starterEntries = [
    { id: 3, date: "2026-11-23", symptoms: "Mild fatigue, slight headache, improving", pain: 3, wellness: 65, notes: "" },
    { id: 2, date: "2026-11-22", symptoms: "Fatigue, mild muscle soreness", pain: 4, wellness: 60, notes: "" },
    { id: 1, date: "2026-11-21", symptoms: "Moderate headache, mild fever", pain: 5, wellness: 55, notes: "" }
];


// ===== 2. Helper functions =====

function getEntries() {
    const text = localStorage.getItem("aidRecovery");
    if (text === null) {
        return starterEntries;
    }
    return JSON.parse(text);
}

// Puts today's date and the default slider values back in the form
function setDefaults() {
    // "en-CA" gives the date as YYYY-MM-DD, which is what a date box needs
    dateBox.value = new Date().toLocaleDateString("en-CA");
    showPain();
    wellnessOutput.textContent = wellnessBox.value + "%";
}

// Moves the progress ring (the CSS reads --value) and changes the number
function showRing(value) {
    ring.style.setProperty("--value", value);
    ringText.textContent = value + "%";
}

// Shows the pain number with a word, like "7 / 10 · Severe"
function showPain() {
    const level = Number(painBox.value);
    let word = "Mild";
    if (level >= 7) {
        word = "Severe";
    } else if (level >= 4) {
        word = "Moderate";
    }
    painOutput.textContent = level + " / 10 · " + word;
}

function addCell(row, text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    row.appendChild(cell);
}

// Draws the table and the progress ring
function render() {
    const entries = getEntries();

    // Newest date first (dates like 2026-11-23 sort correctly as text)
    entries.sort(function (a, b) {
        if (a.date !== b.date) {
            return b.date.localeCompare(a.date);
        }
        // Same day: the entry added last goes first
        return (b.id || 0) - (a.id || 0);
    });

    historyBody.innerHTML = "";
    for (const entry of entries) {
        const row = document.createElement("tr");
        addCell(row, entry.date);
        addCell(row, entry.symptoms);
        addCell(row, entry.pain + " / 10");
        addCell(row, entry.wellness + "%");
        historyBody.appendChild(row);
    }

    // The ring shows the entry that was added last
    let latest = entries[0];
    for (const entry of entries) {
        if ((entry.id || 0) >= (latest.id || 0)) {
            latest = entry;
        }
    }
    showRing(latest.wellness);
}

// A simple pretend assistant that looks for keywords
function answer(question) {
    const text = question.toLowerCase();
    let reply = "I can only give general guidance. For serious symptoms, call 998.";

    if (text.includes("breath") || text.includes("chest")) {
        reply = "Trouble breathing or chest pain is an emergency. Call 998 or send a Critical help request now.";
    } else if (text.includes("fever")) {
        reply = "If your fever returns, rest, drink fluids and contact your doctor. If it is very high or you feel much worse, send an Urgent help request.";
    } else if (text.includes("urgent") || text.includes("pain")) {
        reply = "Switch to an Urgent request if your pain gets worse, reaches 7 or more, or new symptoms appear. For severe symptoms, use Critical.";
    }

    aiAnswer.textContent = reply;
}


// ===== 3. Events =====

// Update the numbers (and the ring) while moving the sliders
painBox.addEventListener("input", showPain);

wellnessBox.addEventListener("input", function () {
    wellnessOutput.textContent = wellnessBox.value + "%";
    showRing(wellnessBox.value);
});

// "Clear Form" resets the form, then we put the defaults back
form.addEventListener("reset", function () {
    setTimeout(function () {
        setDefaults();
        render();
    }, 0);
});

// "Add Recovery Entry"
form.addEventListener("submit", function (event) {
    event.preventDefault();
    formMessage.className = "feedback";

    if (dateBox.value === "") {
        formMessage.textContent = "Please choose a date.";
        formMessage.classList.add("error");
        dateBox.focus();
        return;
    }

    if (symptomBox.value.trim() === "") {
        formMessage.textContent = "Please enter your current symptoms.";
        formMessage.classList.add("error");
        symptomBox.focus();
        return;
    }

    // Add the new entry to the saved list
    const entries = getEntries();
    entries.push({
        id: Date.now(),
        date: dateBox.value,
        symptoms: symptomBox.value.trim(),
        pain: Number(painBox.value),
        wellness: Number(wellnessBox.value),
        notes: notesBox.value.trim()
    });
    localStorage.setItem("aidRecovery", JSON.stringify(entries));

    render();

    formMessage.textContent = "Recovery entry added.";
    // A high pain level gets a safety warning
    if (Number(painBox.value) >= 8) {
        formMessage.textContent = "Entry added. Your pain level is high. Consider sending an Urgent help request.";
    }
    formMessage.classList.add("success");

    // Clear only the text boxes. The sliders and date stay as they are.
    symptomBox.value = "";
    notesBox.value = "";
});

// Assistant
for (const button of quickButtons) {
    button.addEventListener("click", function () {
        answer(button.textContent);
    });
}

aiForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (aiQuestion.value.trim() === "") {
        aiQuestion.focus();
        return;
    }
    answer(aiQuestion.value);
    aiQuestion.value = "";
});

// Find the user's location (same idea as the Request page)
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function () {
            locating.textContent = "Location found.";
        },
        function () {
            locating.textContent = "Location is not available.";
        }
    );
}


// ===== 4. Run when the page opens =====
setDefaults();
render();