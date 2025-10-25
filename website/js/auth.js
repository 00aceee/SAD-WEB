function checkAuth() {
  const username = localStorage.getItem("username");
  const fullname = localStorage.getItem("fullname");
  const role = localStorage.getItem("role");

  if (!username || !fullname) {
    // Store the page they tried to access
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    alert("⚠️ Please log in first to access this page.");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function getCurrentUser() {
  return {
    username: localStorage.getItem("username"),
    fullname: localStorage.getItem("fullname"),
    role: localStorage.getItem("role")
  };
}

function isLoggedIn() {
  return !!localStorage.getItem("username");
}

function clearAuth() {
  localStorage.removeItem("username");
  localStorage.removeItem("fullname");
  localStorage.removeItem("role");
  localStorage.removeItem("redirectAfterLogin");
}