import { formatXP } from "./data.js";

// Function to render the transaction bar chart
export function renderTransactionBarChart(up, down) {
    const barSvg = document.getElementById('transactionBarChart');
    const width = 400, height = 300, padding = 50;
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
    upBar.setAttribute('fill', 'blue');
    barSvg.appendChild(upBar);
    const downBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    downBar.setAttribute('x', padding + barWidth + 10);
    downBar.setAttribute('y', height - padding - downHeight);
    downBar.setAttribute('width', barWidth - 10);
    downBar.setAttribute('height', downHeight);
    downBar.setAttribute('fill', 'red');
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
// Function to render the pie chart for skills distribution 
export function renderPieChart(skillData) {
    const skills = Object.values(skillData.transaction).reduce((result, current) => {
        const existing = result.find((item) => item.type === current.type);
        if (!existing) {
            result.push(current); // Add the item if it doesn't exist
        } else if (current.amount > existing.amount) {
            existing.amount = current.amount; // Update the amount if it's larger
        }
        return result;
    }, []);

    
   const skillLabels  = skills.map(item => item.type);
   const skillAmounts = skills.map(item => item.amount);

    const pieSvg = document.getElementById('skillsPieChart');
    const pieRadius = 200;
    pieSvg.setAttribute('viewBox', `0 0 ${pieRadius * 2} ${pieRadius * 2}`);
    pieSvg.setAttribute('width', pieRadius * 2);
    pieSvg.setAttribute('height', pieRadius * 2);
    const pieCenter = { x: pieRadius, y: pieRadius };
    const pieTotal = skillAmounts.reduce((a, b) => a + b, 0);
    let startAngle = 0;
    const skillsLegendDiv = document.getElementById('skillsLegend');
    skillsLegendDiv.style.display = 'flex';
    skillsLegendDiv.style.flexDirection = 'column';
    skillsLegendDiv.style.marginTop = '10px';
    
    skillAmounts.forEach((amount, index) => {
        const endAngle = startAngle + (2 * Math.PI * (amount / pieTotal));
        const x1 = pieCenter.x + pieRadius * Math.cos(startAngle);
        const y1 = pieCenter.y + pieRadius * Math.sin(startAngle);
        const x2 = pieCenter.x + pieRadius * Math.cos(endAngle);
        const y2 = pieCenter.y + pieRadius * Math.sin(endAngle);
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
        const pathData = `
            M ${pieCenter.x} ${pieCenter.y}
            L ${x1} ${y1}
            A ${pieRadius} ${pieRadius} 0 ${largeArc} 1 ${x2} ${y2}
            Z
        `;
        const color = `hsl(${(index / skillAmounts.length) * 360}, 70%, 50%)`;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', color);
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', '1');
        pieSvg.appendChild(path);
        
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
        // Ensure the amount is treated as a number
        legendText.textContent = `${skillLabels[index]}: ${Number(amount)}`;
        legendItem.appendChild(legendColor);
        legendItem.appendChild(legendText);
        skillsLegendDiv.appendChild(legendItem);
        
        startAngle = endAngle;
    });
}

// Function to render XP progression as a line chart
export function renderXPLineChart(xpData) {
    if (!xpData || xpData.length === 0) return;
    
    // Sort data by createdAt date
    xpData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Define SVG dimensions and margins
    const width = 500, height = 300, margin = 50;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    
    // Select the SVG container and clear previous content
    const lineSvg = document.getElementById('xpLineChart');
    lineSvg.innerHTML = "";
    lineSvg.setAttribute('width', width);
    lineSvg.setAttribute('height', height);
    
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
    polyline.setAttribute('stroke', '#007bff');
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
        circle.setAttribute('fill', '#007bff');
        lineSvg.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx);
        text.setAttribute('y', cy - 8);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#333');
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
        label.setAttribute('fill', '#333');
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
        label.setAttribute('fill', '#333');
        label.textContent = formatXP(val);
        lineSvg.appendChild(label);
    });
    
    // Optionally, draw x-axis and y-axis lines for clarity
    const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxisLine.setAttribute('x1', margin);
    xAxisLine.setAttribute('y1', height - margin);
    xAxisLine.setAttribute('x2', width - margin);
    xAxisLine.setAttribute('y2', height - margin);
    xAxisLine.setAttribute('stroke', '#333');
    xAxisLine.setAttribute('stroke-width', '1');
    lineSvg.appendChild(xAxisLine);
    
    const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxisLine.setAttribute('x1', margin);
    yAxisLine.setAttribute('y1', margin);
    yAxisLine.setAttribute('x2', margin);
    yAxisLine.setAttribute('y2', height - margin);
    yAxisLine.setAttribute('stroke', '#333');
    yAxisLine.setAttribute('stroke-width', '1');
    lineSvg.appendChild(yAxisLine);
}
