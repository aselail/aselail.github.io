import { formatXP } from "./pulldata.js";

// Function to render the transaction bar chart
export function renderTransactionBarChart(up, down) {
    const barSvg = document.getElementById('transactionBarChart');
    const width = barSvg.clientWidth, height = barSvg.clientHeight;
    const padding = 50;
    const barWidth = (width - 2 * padding) / 2;
    const maxBarHeight = height - 2 * padding;
    const total = Math.max(up, down);
    const upHeight = (up / total) * maxBarHeight;
    const downHeight = (down / total) * maxBarHeight;
    barSvg.innerHTML = "";
    const upBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    upBar.setAttribute('x', padding);
    upBar.setAttribute('y', height - padding - upHeight);
    upBar.setAttribute('width', barWidth - 10);
    upBar.setAttribute('height', upHeight);
    upBar.setAttribute('fill', '#4649bd'); //blue color
    barSvg.appendChild(upBar);
    const downBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    downBar.setAttribute('x', padding + barWidth + 10);
    downBar.setAttribute('y', height - padding - downHeight);
    downBar.setAttribute('width', barWidth - 10);
    downBar.setAttribute('height', downHeight);
    downBar.setAttribute('fill', '#f95151'); //red color
    barSvg.appendChild(downBar);
    const upLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    upLabel.setAttribute('x', padding + (barWidth / 2) - 5);
    upLabel.setAttribute('y', height - padding + 20);
    upLabel.setAttribute('text-anchor', 'middle');
    upLabel.setAttribute('fill', '#28a745');  // Green color
    upLabel.style.fontWeight = 'bold';
    upLabel.textContent = 'Done';
    barSvg.appendChild(upLabel);
    const downLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    downLabel.setAttribute('x', padding + barWidth + (barWidth / 2) + 5);
    downLabel.setAttribute('y', height - padding + 20);
    downLabel.setAttribute('text-anchor', 'middle');
    downLabel.setAttribute('fill', '#ff8800');  // Orange color
    downLabel.style.fontWeight = 'bold';
    downLabel.textContent = 'Received' ;
    const upNumber = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    upNumber.setAttribute('x', padding + (barWidth / 2) - 5);
    upNumber.setAttribute('y', height - padding - upHeight - 10);
    upNumber.setAttribute('text-anchor', 'middle');
    upNumber.setAttribute('fill', '#28a745');  // Green color
    upNumber.style.fontWeight = 'bold';
    upNumber.textContent = formatXP(up);
    barSvg.appendChild(upNumber);

    const downNumber = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    downNumber.setAttribute('x', padding + barWidth + (barWidth / 2) + 5);
    downNumber.setAttribute('y', height - padding - downHeight - 10);
    downNumber.setAttribute('text-anchor', 'middle');
    downNumber.setAttribute('fill', '#ff8800');  // Orange color
    downNumber.style.fontWeight = 'bold';
    downNumber.textContent = formatXP(down);
    barSvg.appendChild(downNumber);
    barSvg.appendChild(downLabel);
}


// Function to render XP progression as a line chart
export function renderXPLineChart(xpData) {
    if (!xpData || xpData.length === 0) return;
    
    // Sort data by date
    xpData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // SVG dimensions and margins
    const lineSvg = document.getElementById('xpLineChart');
    const width = lineSvg.clientWidth;
    const height = lineSvg.clientHeight;
    const margin = 50;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    
    // Clear previous content
    lineSvg.innerHTML = "";
    
    // Determine min/max XP values
    const amounts = xpData.map(d => d.amount);
    const minXP = Math.min(...amounts);
    const maxXP = Math.max(...amounts);
    
    // Time range from first to last data points
    const timeStart = new Date(xpData[0].createdAt).getTime();
    const timeEnd = new Date(xpData[xpData.length - 1].createdAt).getTime();
    
    // Scale functions: mapping time to x and XP to y positions
    const xScale = (date) => {
        const t = new Date(date).getTime();
        return margin + ((t - timeStart) / (timeEnd - timeStart)) * chartWidth;
    };
    const yScale = (xp) => {
        return margin + chartHeight - ((xp - minXP) / (maxXP - minXP)) * chartHeight;
    };
    
    // --- Draw Axes (in white) ---
    // X-axis
    const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxisLine.setAttribute('x1', margin);
    xAxisLine.setAttribute('y1', margin + chartHeight);
    xAxisLine.setAttribute('x2', margin + chartWidth);
    xAxisLine.setAttribute('y2', margin + chartHeight);
    xAxisLine.setAttribute('stroke', '#ffffff');
    xAxisLine.setAttribute('stroke-width', '1');
    lineSvg.appendChild(xAxisLine);

    // Y-axis
    const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxisLine.setAttribute('x1', margin);
    yAxisLine.setAttribute('y1', margin);
    yAxisLine.setAttribute('x2', margin);
    yAxisLine.setAttribute('y2', margin + chartHeight);
    yAxisLine.setAttribute('stroke', '#ffffff');
    yAxisLine.setAttribute('stroke-width', '1');
    lineSvg.appendChild(yAxisLine);
    
    // Y-axis labels (formatted XP values)
    [maxXP, minXP].forEach((val, index) => {
      const yPos = index === 0 ? yScale(maxXP) : yScale(minXP);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', margin - 10);
      label.setAttribute('y', yPos + 5);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('font-size', '10');
      label.setAttribute('fill', '#ffffff');
      label.textContent = formatXP(val);
      lineSvg.appendChild(label);
    });
    
    // --- Add Month Labels (rotated vertically) ---
    // Create an array of dates representing the first day of each month
    const gridDates = [];
    let currentDate = new Date(timeStart);
    currentDate.setDate(1); // reset date to 1st of month
    while (currentDate.getTime() <= timeEnd) {
        gridDates.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    gridDates.forEach(date => {
        const x = xScale(date);
        // Create a text element for the month label (rotated vertically)
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', height - margin + 20);
        label.setAttribute('font-size', '10');
        label.setAttribute('fill', '#ffffff');
        label.setAttribute('text-anchor', 'middle');
        // Rotate the label -90 degrees about its (x,y) position
        label.setAttribute('transform', `rotate(-90, ${x}, ${height - margin + 20})`);
        label.textContent = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        lineSvg.appendChild(label);
    });
    
    // --- Draw XP Data (line, points, labels in blue) ---
    // Data polyline
    const points = xpData.map(d => `${xScale(d.createdAt)},${yScale(d.amount)}`).join(" ");
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#007bff');
    polyline.setAttribute('stroke-width', '2');
    lineSvg.appendChild(polyline);
    
    // Data points and labels
    xpData.forEach(d => {
        const cx = xScale(d.createdAt);
        const cy = yScale(d.amount);
        
        // Data point
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', '#007bff');
        lineSvg.appendChild(circle);
        
        // XP value label (formatted)
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx);
        text.setAttribute('y', cy - 8);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#007bff');
        text.textContent = formatXP(d.amount);
        lineSvg.appendChild(text);
    });
}

export function renderRadarChart(skillData) {
    // Aggregate skills: for each skill type, use the maximum amount
    const skillsArray = Object.values(skillData.transaction).reduce((result, current) => {
        const existing = result.find(item => item.type === current.type);
        if (!existing) {
            result.push(current);
        } else if (current.amount > existing.amount) {
            existing.amount = current.amount;
        }
        return result;
    }, []);
    
    const skillLabels = skillsArray.map(item => item.type);
    const skillAmounts = skillsArray.map(item => Number(item.amount));

    // Determine the maximum value among skills for scaling
    const maxValue = Math.max(...skillAmounts);

    // Radar chart dimensions and center
    const radarSvg = document.getElementById('skillsRadarChart');
    const size = Math.min(radarSvg.clientWidth, radarSvg.clientHeight);
    const centerX = size / 2;
    const centerY = size / 2;
    const chartRadius = size / 2 - 40; // leave some margin for labels

    // Clear previous content
    radarSvg.innerHTML = "";

    const numAxes = skillLabels.length;
    const angleSlice = (Math.PI * 2) / numAxes;
    const gridLevels = 5; // number of concentric circles

    // Draw concentric grid circles
    for (let level = 1; level <= gridLevels; level++) {
        const levelRadius = chartRadius * (level / gridLevels);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', levelRadius);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '0.5');
        radarSvg.appendChild(circle);
    }

    // Draw axis lines and add labels for each skill
    for (let i = 0; i < numAxes; i++) {
        const angle = i * angleSlice - Math.PI / 2; // start at the top
        const x = centerX + chartRadius * Math.cos(angle);
        const y = centerY + chartRadius * Math.sin(angle);

        // Draw axis line from center to outer edge
        const axisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        axisLine.setAttribute('x1', centerX);
        axisLine.setAttribute('y1', centerY);
        axisLine.setAttribute('x2', x);
        axisLine.setAttribute('y2', y);
        axisLine.setAttribute('stroke', '#fff');
        axisLine.setAttribute('stroke-width', '0.5');
        radarSvg.appendChild(axisLine);

        // Calculate label position (push it a bit further out)
        const labelOffset = 15;
        const labelX = centerX + (chartRadius + labelOffset) * Math.cos(angle);
        const labelY = centerY + (chartRadius + labelOffset) * Math.sin(angle);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', labelX);
        label.setAttribute('y', labelY);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12');
        label.setAttribute('fill', '#fff');
        label.textContent = skillLabels[i];
        radarSvg.appendChild(label);
    }

    // Compute the points for the radar polygon
    let polygonPoints = "";
    for (let i = 0; i < numAxes; i++) {
        // Normalize the value relative to the maximum
        const norm = skillAmounts[i] / maxValue;
        const angle = i * angleSlice - Math.PI / 2;
        const x = centerX + chartRadius * norm * Math.cos(angle);
        const y = centerY + chartRadius * norm * Math.sin(angle);
        polygonPoints += `${x},${y} `;
    }

    // Draw the radar polygon
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', polygonPoints.trim());
    polygon.setAttribute('fill', 'rgba(0, 123, 255, 0.5)');
    polygon.setAttribute('stroke', '#007bff');
    polygon.setAttribute('stroke-width', '2');
    radarSvg.appendChild(polygon);
    
    const skillsLegendDiv = document.getElementById('skillsLegend');
    skillsLegendDiv.innerHTML = ""; // clear previous legend content
    skillsLegendDiv.style.display = 'flex';
    skillsLegendDiv.style.flexDirection = 'column';
    skillsLegendDiv.style.marginTop = '10px';
    
    for (let i = 0; i < numAxes; i++) {
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.marginBottom = '5px';
        
        const numberIndicator = document.createElement('span');
        numberIndicator.textContent = (i + 1) + '.';
        numberIndicator.style.marginRight = '10px';
        numberIndicator.style.fontWeight = 'bold';
        
        const legendText = document.createElement('span');
        legendText.textContent = `${skillLabels[i]}: ${skillAmounts[i]}`;
        
        legendItem.appendChild(numberIndicator);
        legendItem.appendChild(legendText);
        skillsLegendDiv.appendChild(legendItem);
    }
}
