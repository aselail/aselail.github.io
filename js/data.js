// data.js

// Helper function to fetch GraphQL data
async function fetchGraphQL(query, variables = {}) {
    const jwt = localStorage.getItem('jwt');
    const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
      },
      body: JSON.stringify({ query, variables })
    });
    return response.json();
  }
  