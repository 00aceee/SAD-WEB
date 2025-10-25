const API_URL = "http://127.0.0.1:5000/login";

async function loginUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("❌ " + (data.error || "Login failed."));
      return;
    }

    alert("✅ " + data.message);

    // Store user info in localStorage for other pages
    localStorage.setItem("username", data.username);
    localStorage.setItem("fullname", data.fullname);
    localStorage.setItem("role", data.role);

    // Redirect based on role
    if (data.role === "Admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }

  } catch (err) {
    alert("⚠️ Network error: " + err.message);
  }
}

function openSignup() {
  window.location.href = "signup.html";
}

function openForgotPassword() {
  window.location.href = "forgot_password.html";
}
