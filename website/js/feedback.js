const API_URL = "http://127.0.0.1:5000/feedback";
let selectedRating = 0;

// Update star rating visually
function setRating(value) {
    selectedRating = value;
    const stars = document.querySelectorAll("#stars span");
    stars.forEach((star, index) => {
        star.textContent = index < value ? "★" : "☆";
        star.classList.toggle("active", index < value);
    });
}

// Submit feedback to the server
async function submitFeedback() {
    const message = document.getElementById("message").value.trim();
    const username = localStorage.getItem("username");

    // Check if logged in
    if (!username) {
        alert("⚠️ Please log in first to submit feedback.");
        window.location.href = "login.html";
        return;
    }

    // Validate inputs
    if (selectedRating === 0 || message === "") {
        alert("⚠️ Please select a rating and write a message.");
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, stars: selectedRating, message })
        });

        const result = await res.json();

        if (res.ok) {
            alert("✅ " + result.message);
            document.getElementById("message").value = "";
            setRating(0);
            loadFeedback();
        } else {
            alert("❌ " + (result.error || "Failed to submit feedback."));
        }
    } catch (err) {
        alert("⚠️ Network error: " + err.message);
    }
}

// Load all feedback from server
async function loadFeedback() {
    try {
        const res = await fetch(API_URL);
        const feedbackList = await res.json();
        const list = document.getElementById("feedbackList");
        list.innerHTML = "";
        feedbackList.forEach(fb => addFeedbackCard(fb));
    } catch (err) {
        console.error("Error loading feedback:", err);
    }
}

// Render a single feedback card
function addFeedbackCard(fb) {
    const list = document.getElementById("feedbackList");
    const card = document.createElement("div");
    card.className = "feedback-card";
    const stars = "★".repeat(fb.stars) + "☆".repeat(5 - fb.stars);

    card.innerHTML = `
    <div class="feedback-header">
      <h3>${fb.username}</h3>
      <small>${fb.date}</small>
    </div>
    <div class="feedback-stars">${stars}</div>
    <p class="feedback-message">${fb.message}</p>
    ${fb.reply ? `<div class="admin-reply"><strong>Admin Response:</strong> ${fb.reply}</div>` : ""}
  `;
    list.appendChild(card);
}

// Initialize feedback list on page load
window.onload = loadFeedback;
