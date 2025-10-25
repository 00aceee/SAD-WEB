document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date");
    const timeSelect = document.getElementById("time");
    const form = document.getElementById("bookingForm");
    const submitBtn = document.getElementById("submitBtn");

    const AVAILABLE_TIMES = [
        "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00", "17:00"
    ];

    const BOOKING_API = "/api/bookings"; // replace with your real API endpoint
    const CURRENT_USER = "current_user"; // replace with actual username logic

    // Minimum date = today
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;

    // Fetch booked slots from server
    async function fetchBookedSlots(date) {
        try {
            const res = await fetch(`http://127.0.0.1:5000/appointments/available_slots?date=${date}`);
            const data = await res.json();
            return data.booked_times || [];
        } catch (err) {
            console.error("Failed to fetch slots:", err);
            return [];
        }
    }

    // Update time options when a date is chosen
    dateInput.addEventListener("change", async () => {
        const selectedDate = dateInput.value;
        timeSelect.innerHTML = "<option>Loading...</option>";
        timeSelect.disabled = true;

        if (!selectedDate) {
            timeSelect.innerHTML = "<option>- Select a Date First -</option>";
            return;
        }

        const booked = await fetchBookedSlots(selectedDate);
        const available = AVAILABLE_TIMES.filter(t => !booked.includes(t));

        if (available.length === 0) {
            timeSelect.innerHTML = "<option>- NO SLOTS AVAILABLE -</option>";
        } else {
            timeSelect.innerHTML = "";
            available.forEach(time => {
                const opt = document.createElement("option");
                opt.value = time;
                opt.textContent = time;
                timeSelect.appendChild(opt);
            });
            timeSelect.disabled = false;
        }
    });

    // Handle form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullname = document.getElementById("fullname").value;
        const service = document.getElementById("service").value;
        const date = dateInput.value;
        const time = timeSelect.value;
        const remarks = document.getElementById("remarks").value.trim();

        if (!service || !date || !time || time.includes("Select")) {
            alert("Please fill out all required fields correctly.");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";

        try {
            const res = await fetch(BOOKING_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: CURRENT_USER, fullname, service, date, time, remarks })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Booking failed");

            alert(`✅ Booking confirmed for ${fullname}\nService: ${service}\nDate: ${date}\nTime: ${time}\nStatus: PENDING`);

            form.reset();
            timeSelect.disabled = true;
            timeSelect.innerHTML = "<option>- Select a Date First -</option>";
        } catch (err) {
            alert(`❌ Error: ${err.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Confirm Booking";
        }
    });
});
