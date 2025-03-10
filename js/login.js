import { profile } from './profile.js';

// Function to handle login
export async function login() {
    const existingToken = localStorage.getItem('authToken');
    // Check if token exists and is valid before showing login
    if (existingToken && await isTokenValid(existingToken)) {
        profile();  // Redirect to profile if already logged in
        return;
    }
    // Show the login page if not logged in
    document.body.className = '';
    document.body.classList.add('login-page-body');
    var pageBody = `
        <div class="login-box">
            <h2>Login</h2>
            <form id="loginForm">
                <div class="user-box">
                    <input type="text" id="uname" required="">
                    <label for="uname">Username</label>
                </div>
                <div class="user-box">
                    <input type="password" id="psw" required="">
                    <label for="psw">Password</label>
                </div>
                <p id="errorMessage" style="color: red;"></p>
                <button class="login-button" type="submit">Login</button>
            </form>
        </div>
    `;
    document.body.innerHTML = pageBody;
    // Handle form submission
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault(); 
        const username = document.getElementById('uname').value;
        const password = document.getElementById('psw').value;
        const errorMessage = document.getElementById('errorMessage');
        try {
            const credentials = btoa(`${username}:${password}`);
            const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            const data = await response.json();
            const jwt = data;
            // Save the JWT securely
            localStorage.setItem('authToken', jwt);
            // Redirect to the profile page
            profile();
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}
// Helper function to validate token
async function isTokenValid(token) {
    try {
        const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query { user { id } }`
            })
        });
        return response.ok;  // Token is valid if response is OK
    } catch {
        return false;  // Invalid token if request fails
    }
}