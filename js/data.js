import {logout} from "./logout.js" ;

URL = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

// pullData function to fetch data from the server
export async function pullData(query) {
    // Check if the user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.warn("No auth token, redirecting to login.");
        login();
        return null;
    }
    // Fetch data from the server
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (data.errors) {
            throw new Error(data.errors[0].message);
        }
        // Return the data
        return data.data; 
    } catch (error) { // Catch any errors
        console.error("Error in pullData:", error);
        logout(); // Logout the user
        return null;
    }
}


export function formatXP(xp) {
  if (xp > 1000000) {
    return (xp / 1000000).toFixed(2) + " MB";
  } else if (xp > 1000) {
    return (xp / 1000).toFixed(2) + " KB";
  } else {
    return xp + " B";
  }
}