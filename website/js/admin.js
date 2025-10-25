const BASE_URL = "http://127.0.0.1:5000";
// -------------------- Admin Panel JS --------------------

document.addEventListener("DOMContentLoaded", () => {
    // Optionally load default panel
    showPanel('appointments');
});

// -------------------- Panel Loader --------------------
async function showPanel(panel) {
    const content = document.getElementById("adminContent");
    content.innerHTML = ""; // Clear previous content

    if (panel === "appointments") await showAppointments(content);
    else if (panel === "users") await showUsers(content);
    else if (panel === "feedback") await showFeedback(content);
}

// -------------------- Appointments --------------------
async function showAppointments(container) {
    container.innerHTML = `
    <h2>Manage Appointments</h2>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody id="apptTable"><tr><td colspan="7">Loading...</td></tr></tbody>
    </table>
  `;

    try {
        const res = await fetch('http://127.0.0.1:5000/admin/appointments');
        if (!res.ok) throw new Error("Failed to fetch appointments");

        const appointments = await res.json();
        const tbody = document.getElementById("apptTable");
        tbody.innerHTML = "";

        if (appointments.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7">No appointments found.</td></tr>`;
            return;
        }

        appointments.forEach(apt => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${apt.id}</td>
                <td>${apt.fullname}</td>
                <td>${apt.service}</td>
                <td>${apt.date}</td>
                <td>${apt.time}</td>
                <td class="status ${apt.status.toLowerCase()}">${apt.status}</td>
                <td>
                ${apt.status === 'Pending' ? `
                    <button class="action-btn approve" onclick="updateAppointmentStatus(${apt.id}, 'Approved')">Approve</button>
                    <button class="action-btn deny" onclick="updateAppointmentStatus(${apt.id}, 'Denied')">Deny</button>
                ` : `<span>-</span>`}
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="error">❌ Error loading appointments: ${err.message}</p>`;
    }
}

async function updateAppointmentStatus(id, status) {
    try {
        const res = await fetch(`http://127.0.0.1:5000/admin/appointments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to update appointment");
        }

        alert(`✅ Appointment #${id} marked as ${status}`);
        await showAppointments(document.getElementById('adminContent'));

    } catch (err) {
        alert(`⚠️ Error: ${err.message}`);
    }
}

// -------------------- Users --------------------
async function showUsers(container) {
    container.innerHTML = `
    <h2>Manage Users</h2>
    <button class="action-btn approve" onclick="addUser()">➕ Add New User</button>
    <table class="table">
      <thead><tr><th>Full Name</th><th>Username</th><th>Email</th><th>Role</th></tr></thead>
      <tbody id="userTable"><tr><td colspan="4">Loading...</td></tr></tbody>
    </table>
  `;

    try {
        const res = await fetch('http://127.0.0.1:5000/admin/users');
        if (!res.ok) throw new Error("Failed to fetch users");

        const users = await res.json();
        const tbody = document.getElementById("userTable");
        tbody.innerHTML = "";

        if (users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">No users found.</td></tr>`;
            return;
        }

        users.forEach(u => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${u.fullname}</td><td>${u.username}</td><td>${u.email}</td><td>${u.role}</td>`;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="error">❌ Error loading users: ${err.message}</p>`;
    }
}


function addUser() {
    const modal = document.getElementById("addUserModal");
    modal.style.display = "flex";

    const closeBtn = modal.querySelector(".close");
    closeBtn.onclick = () => (modal.style.display = "none");

    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };

    const form = document.getElementById("addUserForm");
    form.onsubmit = async (e) => {
        e.preventDefault();

        const data = {
            fullname: document.getElementById("fullname").value.trim(),
            username: document.getElementById("username").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value.trim(),
            confirm_password: document.getElementById("confirm_password").value.trim(),
            role: document.getElementById("role").value.trim(),
        };

        try {
            if (data.password !== data.confirm_password)
                throw new Error("Passwords don't match");

            const res = await fetch(`${BASE_URL}/admin/add_user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to add user");
            }

            alert("✅ User added successfully!");
            modal.style.display = "none";
            await showUsers(document.getElementById("adminContent"));
        } catch (err) {
            alert("❌ " + err.message);
        }
    };
}

// -------------------- Feedback --------------------
async function showFeedback(container) {
    container.innerHTML = `
    <h2>View Feedback</h2>
    <table class="table">
      <thead>
        <tr>
          <th>User</th>
          <th>Rating</th>
          <th>Message</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="feedbackTable">
        <tr><td colspan="5">Loading...</td></tr>
      </tbody>
    </table>
  `;

    try {
        const res = await fetch("http://127.0.0.1:5000/admin/feedback");
        if (!res.ok) throw new Error("Failed to fetch feedback");

        const feedback = await res.json();
        const tbody = document.getElementById("feedbackTable");
        tbody.innerHTML = "";

        if (feedback.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">No feedback found.</td></tr>`;
            return;
        }

        feedback.forEach((f) => {
            const stars = "★".repeat(f.stars) + "☆".repeat(5 - f.stars);
            const status = f.resolved ? "Resolved" : "Pending";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${f.user}</td>
                <td>${stars}</td>
                <td>${f.message}</td>
                <td class="status ${f.resolved ? "approved" : "pending"}">${status}</td>
                <td>
                <button class="action-btn reply">💬 Reply</button>
                <button class="action-btn resolve">${f.resolved ? "❌ Unresolve" : "✅ Resolve"}</button>
                </td>
            `;

            // Attach event listeners AFTER adding to DOM
            const replyBtn = tr.querySelector(".reply");
            const resolveBtn = tr.querySelector(".resolve");

            replyBtn.addEventListener("click", () => {
                replyFeedback({
                    id: f.id,
                    username: f.user,
                    email: f.email,
                    stars: f.stars,
                    message: f.message,
                    existingReply: f.reply || "",
                });
            });

            resolveBtn.addEventListener("click", () => {
                toggleResolved(f.id, !f.resolved);
            });

            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="error">❌ Error loading feedback: ${err.message}</p>`;
    }
}


// Show feedback reply modal
function replyFeedback(feedback) {
    const modal = document.getElementById('replyModal');
    const usernameEl = document.getElementById('modalUsername');
    const emailWrapEl = document.getElementById('modalEmailWrap');
    const emailEl = document.getElementById('modalEmail');
    const starsEl = document.getElementById('modalStars');
    const messageEl = document.getElementById('modalMessage');
    const replyBox = document.getElementById('replyBox');
    const sendEmailCheckbox = document.getElementById('sendEmail');
    const noEmailNote = document.getElementById('noEmailNote');

    // Populate modal
    usernameEl.textContent = feedback.username;
    messageEl.textContent = feedback.message;
    starsEl.innerHTML = '★'.repeat(feedback.stars) + '☆'.repeat(5 - feedback.stars);
    replyBox.value = feedback.existingReply || '';

    if (feedback.email) {
        emailWrapEl.style.display = 'block';
        emailEl.textContent = feedback.email;
        sendEmailCheckbox.disabled = false;
        sendEmailCheckbox.checked = true;
        noEmailNote.style.display = 'none';
    } else {
        emailWrapEl.style.display = 'none';
        sendEmailCheckbox.disabled = true;
        sendEmailCheckbox.checked = false;
        noEmailNote.style.display = 'block';
    }

    // Show modal
    modal.style.display = 'flex';

    // Cancel button closes modal
    document.getElementById('cancelBtn').onclick = () => {
        modal.style.display = 'none';
    };

    // Send reply
    document.getElementById('sendReplyBtn').onclick = async () => {
        const replyText = replyBox.value.trim();
        const sendEmail = sendEmailCheckbox.checked;

        if (!replyText) {
            alert('Reply cannot be empty.');
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/admin/feedback/reply/${feedback.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reply: replyText, sendEmail })
            });

            const data = await res.json();
            if (res.ok) {
                alert('✅ Reply sent successfully!');
                modal.style.display = 'none';
                showFeedback(document.getElementById('adminContent')); // refresh list
            } else {
                alert(`❌ Error: ${data.message || 'Failed to send reply.'}`);
            }
        } catch (err) {
            alert(`⚠️ Request failed: ${err.message}`);
        }
    };
}


window.addEventListener('click', (e) => {
    const modal = document.getElementById('replyModal');
    if (e.target === modal) modal.style.display = 'none';
});


async function toggleResolved(id, resolved) {
    try {
        const res = await fetch(`http://127.0.0.1:5000/admin/feedback/${id}/resolve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resolved }), 
        });

        const data = await res.json();
        if (res.ok) {
            alert(`Feedback ${resolved ? "marked as resolved" : "set to pending"}.`);
            const container = document.getElementById("adminContent"); 
            showFeedback(container);

        } else {
            alert(`Error: ${data.message || "Failed to update status."}`);
        }
    } catch (err) {
        alert(`Request failed: ${err.message}`);
    }
}

// -------------------- Logout --------------------
function logout() {
    alert("Logged out successfully!");
    window.location.href = "login.html";
}
