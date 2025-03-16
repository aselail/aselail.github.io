import { login } from "./auth.js";
import { profile } from "./profile.js";

const jwt = localStorage.getItem('authToken');
// Check if the user is logged in
if (!jwt) {
    login();
} else {
    profile();
}