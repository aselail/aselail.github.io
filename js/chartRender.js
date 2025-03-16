import { formatXP } from "./data.js";

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
    
    // Sort data by createdAt date
    xpData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Define SVG dimensions and margins
    const lineSvg = document.getElementById('xpLineChart');
    const width = lineSvg.clientWidth, height = lineSvg.clientHeight;
    const margin = 50;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    
    // Clear previous content
    lineSvg.innerHTML = "";
    
    // Determine minimum and maximum XP values
    const amounts = xpData.map(d => d.amount);
    const minXP = Math.min(...amounts);
    const maxXP = Math.max(...amounts);
    
    // Define time boundaries based on XP data timestamps
    const timeStart = new Date(xpData[0].createdAt).getTime();
    const timeEnd = new Date(xpData[xpData.length - 1].createdAt).getTime();
    
    // Scale functions: x maps date to horizontal position; y maps XP to vertical position (inverted)
    const xScale = (date) => {
        const t = new Date(date).getTime();
        return margin + ((t - timeStart) / (timeEnd - timeStart)) * chartWidth;
    };
    const yScale = (xp) => {
        return margin + chartHeight - ((xp - minXP) / (maxXP - minXP)) * chartHeight;
    };
    
    // Construct the polyline points from the XP data
    const points = xpData.map(d => `${xScale(d.createdAt)},${yScale(d.amount)}`).join(" ");
    // Create the polyline element for the line chart
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#fff');
    polyline.setAttribute('stroke-width', '2');
    lineSvg.appendChild(polyline);
    
    // Plot circles and XP labels for each data point
    xpData.forEach(d => {
        const cx = xScale(d.createdAt);
        const cy = yScale(d.amount);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', '#fff');
        lineSvg.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx);
        text.setAttribute('y', cy - 8);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#fff');
        text.textContent = formatXP(d.amount);
        lineSvg.appendChild(text);
    });
    
    // Add x-axis labels: display first, middle, and last date
    const firstDate = new Date(timeStart);
    const midDate = new Date((timeStart + timeEnd) / 2);
    const lastDate = new Date(timeEnd);
    const xAxisDates = [firstDate, midDate, lastDate];
    const xAxisPositions = [
        xScale(timeStart),
        xScale((timeStart + timeEnd) / 2),
        xScale(timeEnd)
    ];
    
    xAxisDates.forEach((date, index) => {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', xAxisPositions[index]);
        label.setAttribute('y', height - margin + 20);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '10');
        label.setAttribute('fill', '#fff');
        label.textContent = date.toLocaleDateString();
        lineSvg.appendChild(label);
    });
    
    // Add y-axis labels: display maximum and minimum XP values on the left side
    const yAxisValues = [maxXP, minXP];
    const yAxisPositions = [yScale(maxXP), yScale(minXP)];
    
    yAxisValues.forEach((val, index) => {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', margin - 10);
        label.setAttribute('y', yAxisPositions[index] + 5);
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('font-size', '10');
        label.setAttribute('fill', '#fff');
        label.textContent = formatXP(val);
        lineSvg.appendChild(label);
    });
    
    // Optionally, draw x-axis and y-axis lines for clarity
    const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxisLine.setAttribute('x1', margin);
    xAxisLine.setAttribute('y1', height - margin);
    xAxisLine.setAttribute('x2', width - margin);
    xAxisLine.setAttribute('y2', height - margin);
    xAxisLine.setAttribute('stroke', '#fff');
    xAxisLine.setAttribute('stroke-width', '1');
    lineSvg.appendChild(xAxisLine);
    
    const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxisLine.setAttribute('x1', margin);
    yAxisLine.setAttribute('y1', margin);
    yAxisLine.setAttribute('x2', margin);
    yAxisLine.setAttribute('y2', height - margin);
    yAxisLine.setAttribute('stroke', '#fff');
    yAxisLine.setAttribute('stroke-width', '1');
    lineSvg.appendChild(yAxisLine);
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
        // Use a color scale similar to pie chart slices.
        const color = `hsl(${(i / numAxes) * 360}, 70%, 50%)`;
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.marginBottom = '5px';
        
        const legendColor = document.createElement('span');
        legendColor.style.width = '20px';
        legendColor.style.height = '20px';
        legendColor.style.backgroundColor = color;
        legendColor.style.marginRight = '10px';
        
        const legendText = document.createElement('span');
        legendText.textContent = `${skillLabels[i]}: ${skillAmounts[i]}`;
        
        legendItem.appendChild(legendColor);
        legendItem.appendChild(legendText);
        skillsLegendDiv.appendChild(legendItem);
    }
}

export function renderAuditHorizontalBarChart(up, down) {
    const svg = document.getElementById('transactionBarChart');
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    svg.innerHTML = "";
    
    // Set margins and bar sizing
    const leftMargin = 50; // for labels
    const rightMargin = 20;
    const topMargin = 40;
    const barHeight = 40;
    const spacing = 20;
    const maxBarWidth = width - leftMargin - rightMargin;
    
    // Find the maximum to scale the widths
    const total = Math.max(up, down);
    
    // Calculate widths proportionally
    const upBarWidth = (up / total) * maxBarWidth;
    const downBarWidth = (down / total) * maxBarWidth;
    
    // Draw the 'Done' (up) bar
    const upBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    upBar.setAttribute('x', leftMargin);
    upBar.setAttribute('y', topMargin);
    upBar.setAttribute('width', upBarWidth);
    upBar.setAttribute('height', barHeight);
    upBar.setAttribute('fill', '#4649bd'); // blue color
    svg.appendChild(upBar);
    
    // Add label for Done value (placed at the end of the bar)
    const upLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    upLabel.setAttribute('x', leftMargin + upBarWidth + 5);
    upLabel.setAttribute('y', topMargin + barHeight / 2 + 5);
    upLabel.setAttribute('font-size', '14');
    upLabel.setAttribute('fill', '#28a745'); // green color for text
    upLabel.textContent = 'Done: ' + up;
    svg.appendChild(upLabel);
    
    // Draw the 'Received' (down) bar
    const downBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    downBar.setAttribute('x', leftMargin);
    downBar.setAttribute('y', topMargin + barHeight + spacing);
    downBar.setAttribute('width', downBarWidth);
    downBar.setAttribute('height', barHeight);
    downBar.setAttribute('fill', '#f95151'); // red color
    svg.appendChild(downBar);
    
    // Add label for Received value
    const downLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    downLabel.setAttribute('x', leftMargin + downBarWidth + 5);
    downLabel.setAttribute('y', topMargin + barHeight + spacing + barHeight / 2 + 5);
    downLabel.setAttribute('font-size', '14');
    downLabel.setAttribute('fill', '#ff8800'); // orange color for text
    downLabel.textContent = 'Received: ' + down;
    svg.appendChild(downLabel);
}
