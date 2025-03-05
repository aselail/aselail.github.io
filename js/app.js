// app.js
document.addEventListener('DOMContentLoaded', () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      // Show profile view if authenticated
      document.getElementById('login-view').style.display = 'none';
      document.getElementById('profile-view').style.display = 'block';
      loadProfileData();
    } else {
      // Otherwise, show login view
      document.getElementById('login-view').style.display = 'block';
      document.getElementById('profile-view').style.display = 'none';
    }
  });
  