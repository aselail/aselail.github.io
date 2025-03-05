// login.js
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;
    const credentials = btoa(`${identifier}:${password}`);
  
    try {
      const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + credentials,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok && data && data.token) {
        localStorage.setItem('jwt', data.token);
        // Switch to profile view
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('profile-view').style.display = 'block';
        loadProfileData();
      } else {
        document.getElementById('login-error').textContent = 'Invalid credentials!';
      }
    } catch (err) {
      document.getElementById('login-error').textContent = 'Error during login';
      console.error(err);
    }
  });
