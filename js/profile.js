// profile.js

// Main function to load profile data and charts
async function loadProfileData() {
    await loadUserProfile();
    await loadAndRenderCharts();
    // Re-fetch data every 10 seconds for realtime updates
    setInterval(async () => {
      await loadUserProfile();
      await loadAndRenderCharts();
    }, 10000);
  }
  
  // Load basic user profile info
  async function loadUserProfile() {
    try {
      const response = await fetchGraphQL(USER_QUERY);
      if (response.data && response.data.user && response.data.user.length > 0) {
        const user = response.data.user[0];
        document.getElementById('profile-data').innerHTML = `
          <p><strong>ID:</strong> ${user.id}</p>
          <p><strong>Login:</strong> ${user.login}</p>
        `;
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }
  
  // Load data for charts and call chart render functions
  async function loadAndRenderCharts() {
    // Clear current charts
    document.getElementById('graphs').innerHTML = '';
    
    // Load XP transactions data
    const xpResponse = await fetchGraphQL(TRANSACTION_QUERY);
    const xpData = xpResponse.data && xpResponse.data.transaction ? xpResponse.data.transaction : [];
    renderXPChart(xpData);
    
    // Load progress data
    const progressResponse = await fetchGraphQL(PROGRESS_QUERY);
    const progressData = progressResponse.data && progressResponse.data.progress ? progressResponse.data.progress : [];
    renderProgressChart(progressData);
  }
  