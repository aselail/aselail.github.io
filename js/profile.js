import {pullData} from "./data.js";
import {logout} from "./logout.js";
import { renderTransactionBarChart, renderPieChart , renderXPLineChart} from "./chartRender.js";

export async function profile() {
    try {
        const userData = await pullData(userQury); 
        const user = userData.user[0];
        const auditRatio = typeof user.auditRatio === 'number' ? user.auditRatio.toFixed(1) : 'N/A';
        const skillsData = await pullData(skillQury)
        const xpDataResult = await pullData(xpQury); 
        const xpData = xpDataResult.transaction; 


        console.log(user);
       
        if (!userData || userData.length === 0) {
            console.error("No user data found");
            logout();
            return;
        }
        
        document.body.className = '';
        document.body.classList.add('profile-page-body');
        document.body.innerHTML = `
            <div class="profile-container">
                <header>
                    <h1>Welcome, ${user.login}</h1>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </header>
                <section class="profile-info">
                    <p><strong>User ID:</strong> ${user.id}</p>
                    <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Campus:</strong> ${user.campus}</p>
                    <p><strong>gender :</strong> ${user.attrs.gender}</p>
                   
                  
                <section class="charts">
                    <div class="skill-chart-container">
                        <h3>Skills Distribution</h3>
                        <svg id="skillsPieChart" width="400" height="400"></svg>
                        <div id="skillsLegend"></div>
                    </div>
                    <div class="audit-chart-container">
                        <h3>Audits Ratio: ${auditRatio}</h3>
                        <svg id="transactionBarChart" width="400" height="300"></svg>
                    </div>
                    <div class="xp-chart-container">
                    <h3>XP Line Chart</h3>
                    <svg id="xpLineChart"></svg>
                </section>
            </div>
        `;
        renderTransactionBarChart(user.totalUp, user.totalDown);
        renderPieChart(skillsData);
        renderXPLineChart(xpData);
    } catch (error) {
        console.error("Error in profile function:", error);
    }
}


const xpQury = `
    query Transaction {
        transaction(order_by: { createdAt: asc }, where: { type: { _eq: "xp" }, path: { _niregex: "piscine-js/|piscine-bh"  _iregex: "bh-module"} }) {
            amount
            attrs
            createdAt
            originEventId
            path
            type
        }
    }
`;

const userQury = `
  query User {
        user {
            id
            login 
            attrs
            firstName
            lastName
            email
            campus
            totalUp
            totalDown
            auditRatio
            progresses {
                grade
                path
                updatedAt
            }
            transactions {
                amount
                type
                path
                createdAt
            }
        }
    }
`;

const skillQury = `
    query Transaction {
        transaction(order_by: { createdAt: asc }, where: { type: {_iregex: "skill" }}) {
            type
            amount
            attrs
            createdAt
            path
        }
    }
`;
