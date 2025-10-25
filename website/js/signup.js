const BASE_URL = "http://127.0.0.1:5000";

async function sendOTP() {
    const email = document.getElementById("email").value.trim();
    const btn = document.getElementById("sendOtpBtn");
    
    function isGmail(email) {
        return /^[^\s@]+@gmail\.com$/i.test(email); // i = case-insensitive
    }

    if (!isGmail(email)) {
        alert("Please enter a valid Gmail address.");
        return;
    }


    btn.disabled = true;
    btn.textContent = "Sending...";

    try {
        const res = await fetch(`${BASE_URL}/signup/send_otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to send OTP");

        alert("✅ " + data.message);
        btn.textContent = "Sent!";
    } catch (err) {
        alert("❌ " + err.message);
        btn.textContent = "Send OTP";
        btn.disabled = false;
    }
}

async function registerUser() {
    const payload = {
        fullname: document.getElementById("fullname").value.trim(),
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        confirm_password: document.getElementById("confirm_password").value.trim(),
        otp: document.getElementById("otp").value.trim()
    };

    try {
        const res = await fetch(`${BASE_URL}/signup/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed.");

        alert("✅ " + data.message);
        window.location.href = "login.html";
    } catch (err) {
        alert("❌ " + err.message);
    }
}

function goToLogin() {
    window.location.href = "login.html";
}
