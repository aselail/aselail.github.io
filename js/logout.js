// logout.js
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('jwt');
    document.getElementById('profile-view').style.display = 'none';
    document.getElementById('login-view').style.display = 'block';
  });
  