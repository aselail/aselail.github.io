// chartRender.js

// Render a bar chart for XP transactions
function renderXPChart(transactions) {
    if (!transactions.length) {
      document.getElementById('graphs').innerHTML += '<h2>No XP Data Available</h2>';
      return;
    }
    
    // Sort transactions by date
    transactions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const xpData = transactions.map(t => t.amount);
    
    const svgWidth = 400;
    const svgHeight = 200;
    const barWidth = svgWidth / xpData.length;
    let svgContent = `<svg width="${svgWidth}" height="${svgHeight}">`;
    
    xpData.forEach((xp, index) => {
      const barHeight = (xp / Math.max(...xpData)) * svgHeight;
      const x = index * barWidth;
      const y = svgHeight - barHeight;
      svgContent += `<rect x="${x + 10}" y="${y}" width="${barWidth - 20}" height="${barHeight}" fill="#4287f5"></rect>
                     <text x="${x + (barWidth / 2)}" y="${y - 5}" font-size="12" text-anchor="middle">${xp}</text>`;
    });
    svgContent += '</svg>';
    document.getElementById('graphs').innerHTML += `<h2>XP Earned Over Time</h2>` + svgContent;
  }
  
  // Render a pie chart for progress (PASS/FAIL ratio)
  function renderProgressChart(progressData) {
    if (!progressData.length) {
      document.getElementById('graphs').innerHTML += '<h2>No Progress Data Available</h2>';
      return;
    }
  
    // Count PASS (grade === 1) vs FAIL (grade !== 1)
    let passCount = 0, failCount = 0;
    progressData.forEach(item => {
      if (item.grade === 1) {
        passCount++;
      } else {
        failCount++;
      }
    });
    const total = passCount + failCount;
    if (total === 0) return;
  
    const passRatio = (passCount / total) * 100;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const passStroke = (passRatio / 100) * circumference;
    const failStroke = circumference - passStroke;
  
    const svgContent = `
      <svg width="150" height="150">
        <circle cx="75" cy="75" r="${radius}" fill="none" stroke="#4287f5" stroke-width="30"
          stroke-dasharray="${passStroke} ${failStroke}" transform="rotate(-90 75 75)" />
        <circle cx="75" cy="75" r="${radius}" fill="none" stroke="red" stroke-width="30"
          stroke-dasharray="${failStroke} ${passStroke}" transform="rotate(${passRatio / 100 * 360 - 90} 75 75)" />
        <text x="75" y="80" text-anchor="middle" font-size="16">${passCount} / ${total}</text>
      </svg>
    `;
    document.getElementById('graphs').innerHTML += `<h2>Progress Overview</h2>` + svgContent;
  }
  