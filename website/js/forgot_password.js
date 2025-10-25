const sendOtpBtn = document.getElementById('sendOtpBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsg = document.getElementById('statusMsg');

sendOtpBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();

  if (!email || !email.endsWith('@gmail.com')) {
    alert('Please enter a valid Gmail address.');
    return;
  }

  sendOtpBtn.disabled = true;
  sendOtpBtn.textContent = 'Sending...';
  statusMsg.textContent = '';

  try {
    const response = await fetch('/api/send_otp', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email})
    });
    const data = await response.json();
    if (data.success) {
      alert('OTP sent! Please check your email.');
      statusMsg.textContent = `OTP sent to ${email}`;
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Error sending OTP.');
  } finally {
    sendOtpBtn.disabled = false;
    sendOtpBtn.textContent = 'Send OTP';
  }
});

resetBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const otp = document.getElementById('otp').value.trim();
  const newPass = document.getElementById('newPass').value;
  const confirmPass = document.getElementById('confirmPass').value;

  if (!email || !otp || !newPass || !confirmPass) {
    alert('Please fill in all fields.');
    return;
  }
  if (newPass.length < 6) {
    alert('Password must be at least 6 characters.');
    return;
  }
  if (newPass !== confirmPass) {
    alert('Passwords do not match.');
    return;
  }

  resetBtn.disabled = true;
  resetBtn.textContent = 'Processing...';

  try {
    const response = await fetch('/api/reset_password', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, otp, new_password: newPass, confirm_password: confirmPass})
    });
    const data = await response.json();
    if (data.success) {
      alert('Password reset successful. You can now login with your new password.');
      window.location.href = '/login.html'; // or wherever you want to redirect
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Error resetting password.');
  } finally {
    resetBtn.disabled = false;
    resetBtn.textContent = 'Reset Password';
  }
});
