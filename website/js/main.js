document.addEventListener("DOMContentLoaded", () => {
  updateProfileButton();
  loadUserProfile();
  applySavedTheme();
});

// Close profile menu when clicking outside
document.addEventListener("click", (e) => {
  const menu = document.getElementById("profileMenu");
  const btn = document.getElementById("profileBtn");
  if (!menu.contains(e.target) && e.target !== btn) {
    menu.classList.remove("visible");
  }
});


function updateProfileButton() {
  const profileBtn = document.getElementById("profileBtn");
  const user = getCurrentUser();

  if (user.username) {
    profileBtn.textContent = "👤";
    profileBtn.onclick = toggleProfileMenu;
  } else {
    profileBtn.textContent = "🔑";
    profileBtn.onclick = () => window.location.href = "login.html";
  }
}

function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu");
  menu.classList.toggle("visible");
}

function loadUserProfile() {
  const user = getCurrentUser();

  if (user.username) {
    document.getElementById("userFullname").textContent = user.fullname;
    document.getElementById("userUsername").textContent = user.username;
    document.getElementById("userEmail").textContent = localStorage.getItem("email") || "N/A";

    loadUpcomingAppointments();
  }
}

async function loadUpcomingAppointments() {
  const username = localStorage.getItem("username");
  const appointmentList = document.getElementById("appointmentList");

  if (!username) {
    appointmentList.innerHTML = "<li>Please log in to view appointments.</li>";
    return;
  }

  appointmentList.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch(`http://127.0.0.1:5000/appointments/${username}`);
    const appointments = await res.json();

    if (!appointments.length) {
      appointmentList.innerHTML = "<li>No upcoming appointments.</li>";
      return;
    }

    appointmentList.innerHTML = appointments
      .filter(apt => apt.status !== 'Cancelled')
      .slice(0, 5)
      .map(apt => `
        <li>
          <strong>${apt.service}</strong> - ${apt.date} at ${apt.time}
          <br><small>Status: ${apt.status}</small>
        </li>
      `).join('');
  } catch (err) {
    appointmentList.innerHTML = "<li>Error loading appointments.</li>";
    console.error(err);
  }
}

function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("dark-mode")) {
    body.classList.replace("dark-mode", "light-mode");
    localStorage.setItem("theme", "light-mode");
  } else {
    body.classList.replace("light-mode", "dark-mode");
    localStorage.setItem("theme", "dark-mode");
  }
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) document.body.className = savedTheme;
}

function logoutUser() {
  if (confirm("Are you sure you want to logout?")) {
    clearAuth();
    alert("✅ You have been logged out.");
    window.location.href = "index.html";
  }
}

function openSection(section) {
  if (section === 'haircut') alert("Haircut styles page coming soon!");
  else if (section === 'tattoo') alert("Tattoo designs page coming soon!");
}

// Helper functions
function getCurrentUser() {
  return {
    username: localStorage.getItem("username"),
    fullname: localStorage.getItem("fullname"),
    role: localStorage.getItem("role")
  };
}

function clearAuth() {
  ["username", "fullname", "role", "redirectAfterLogin"].forEach(key => localStorage.removeItem(key));
}
