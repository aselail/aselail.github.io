import { login } from "./login.js";

export async function logout() {
    const JWT = localStorage.getItem("authToken"); // Match with login's key
    try {
        // Expire the session
        await fetch("https://learn.reboot01.com/api/auth/expire", {
            method: "GET",
            headers: {
                "X-jwt-Token": JWT || "", // Include JWT token if available
            },
        });
        // Perform sign-out
        await fetch("https://learn.reboot01.com/api/auth/signout", {
            method: "POST",
            headers: {
                "X-jwt-Token": JWT || "", // Include JWT token if available
            },
        });
        console.log("Successfully logged out");
    } catch (error) {
        console.error("Failed to log out:", error);
    } finally {
        // Clean up token from local storage
        localStorage.removeItem("authToken");
        console.log("Token removed. Redirecting to login...");
        login(); // Redirect to login form
    }
}
// Attach logout to the global scope
window.logout = logout;