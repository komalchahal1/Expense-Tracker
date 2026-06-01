const expenseForm = document.getElementById("expenseForm");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const transactionList = document.getElementById("transactionList");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

const healthScoreEl = document.getElementById("healthScore");

const goalPercentEl = document.getElementById("goalPercent");

let transactions = [];

/* ==========================
LOCAL STORAGE
========================== */

function saveTransactions() {


localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);

}

function loadTransactions() {


const saved =
    localStorage.getItem("transactions");

if (saved) {

    transactions =
        JSON.parse(saved);
}

renderTransactions();

updateSummary();


}

/* ==========================
ADD TRANSACTION
========================== */

expenseForm.addEventListener(
"submit",
addTransaction
);

function addTransaction(e) {


e.preventDefault();

const transaction = {

    id: Date.now(),

    title:
        titleInput.value.trim(),

    amount:
        Number(amountInput.value),

    type:
        typeInput.value,

    category:
        categoryInput.value,

    date:
        new Date().toLocaleDateString(),

    time:
        new Date().toLocaleTimeString()

};

transactions.unshift(transaction);

saveTransactions();

renderTransactions();

updateSummary();

if (
    typeof updateChart === "function"
) {
    updateChart();
}

if (
    typeof updateCategoryChart === "function"
) {
    updateCategoryChart();
}

if (
    typeof updateAIInsights === "function"
) {
    updateAIInsights();
}

titleInput.value = "";
amountInput.value = "";


}

/* ==========================
SUMMARY
========================== */

function updateSummary() {


let income = 0;
let expense = 0;

transactions.forEach(t => {

    if (t.type === "income") {

        income += t.amount;

    } else {

        expense += t.amount;
    }
});

const balance =
    income - expense;

incomeEl.textContent =
    "₹" + income.toLocaleString();

expenseEl.textContent =
    "₹" + expense.toLocaleString();

balanceEl.textContent =
    "₹" + balance.toLocaleString();

updateHealthScore();

if (
    typeof updateGoalProgress === "function"
) {
    updateGoalProgress();
}


}

/* ==========================
HEALTH SCORE
========================== */

function updateHealthScore() {


let income = 0;
let expense = 0;

transactions.forEach(t => {

    if (t.type === "income") {

        income += t.amount;

    } else {

        expense += t.amount;
    }
});

let score = 100;

if (income > 0) {

    const ratio =
        expense / income;

    score =
        Math.max(
            0,
            Math.round(
                100 - ratio * 100
            )
        );
}

healthScoreEl.textContent =
    score;

}

/* ==========================
FILTERS
========================== */

searchInput.addEventListener(
"input",
renderTransactions
);

filterCategory.addEventListener(
"change",
renderTransactions
);

function getFilteredTransactions() {


const keyword =
    searchInput.value.toLowerCase();

const category =
    filterCategory.value;

return transactions.filter(t => {

    const matchTitle =
        t.title
        .toLowerCase()
        .includes(keyword);

    const matchCategory =
        category === "All"
        ||
        t.category === category;

    return (
        matchTitle &&
        matchCategory
    );

});


}

/* ==========================
RENDER TRANSACTIONS
========================== */

function renderTransactions() {


const filtered =
    getFilteredTransactions();

transactionList.innerHTML = "";

if (
    filtered.length === 0
) {

    transactionList.innerHTML =
        `
        <li>
            No transactions found.
        </li>
    `;

    return;
}

filtered.forEach(t => {

    const li =
        document.createElement("li");

    const amountClass =
        t.type === "income"
            ? "#00ff9d"
            : "#ff4d6d";

    li.innerHTML =
        `
        <div>

            <strong>
                ${t.title}
            </strong>

            <br>

            <small>
                ${t.category}
            </small>

            <br>

            <small>
                ${t.date}
            </small>

        </div>

        <div>

            <span
            style="
            color:${amountClass};
            font-weight:700;
            ">
            ₹${t.amount}
            </span>

            <button
            class="edit-btn"
            data-id="${t.id}">
            ✏️
            </button>

            <button
            class="delete-btn"
            data-id="${t.id}">
            🗑️
            </button>

        </div>
        `;

    transactionList.appendChild(li);
});

attachButtons();
screenLeft

}

/* ==========================
EDIT + DELETE
========================== */

function attachButtons() {


document
    .querySelectorAll(".delete-btn")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                const id =
                    Number(
                        btn.dataset.id
                    );

                transactions =
                    transactions.filter(
                        t => t.id !== id
                    );

                saveTransactions();

                renderTransactions();

                updateSummary();

                if (
                    typeof updateChart === "function"
                ) {
                    updateChart();
                }

                if (
                    typeof updateCategoryChart === "function"
                ) {
                    updateCategoryChart();
                }

                if (
                    typeof updateAIInsights === "function"
                ) {
                    updateAIInsights();
                }

            }
        );

    });

document
    .querySelectorAll(".edit-btn")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                const id =
                    Number(
                        btn.dataset.id
                    );

                const transaction =
                    transactions.find(
                        t => t.id === id
                    );

                const newTitle =
                    prompt(
                        "Edit title",
                        transaction.title
                    );

                const newAmount =
                    prompt(
                        "Edit amount",
                        transaction.amount
                    );

                if (
                    !newTitle ||
                    !newAmount
                ) return;

                transaction.title =
                    newTitle;

                transaction.amount =
                    Number(newAmount);

                saveTransactions();

                renderTransactions();

                updateSummary();

                if (
                    typeof updateChart === "function"
                ) {
                    updateChart();
                }

                if (
                    typeof updateCategoryChart === "function"
                ) {
                    updateCategoryChart();
                }

                if (
                    typeof updateAIInsights === "function"
                ) {
                    updateAIInsights();
                }

            }
        );

    });


}

/* ==========================
   CHARTS
========================== */

let expenseChart;
let categoryChart;

function updateChart() {

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {

        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }

    });

    const ctx =
        document
        .getElementById("expenseChart")
        ?.getContext("2d");

    if (!ctx) return;

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Income",
                "Expense"
            ],

            datasets: [{

                data: [
                    income,
                    expense
                ],

                backgroundColor: [
                    "#00ff9d",
                    "#ff4d6d"
                ],

                borderWidth: 0

            }]
        },

        options: {

            plugins: {

                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                }

            }

        }

    });

}



/* ==========================
   CATEGORY CHART
========================== */

function updateCategoryChart() {

    const categories = {};

    transactions.forEach(t => {

        if (t.type === "expense") {

            if (!categories[t.category]) {

                categories[t.category] = 0;

            }

            categories[t.category] += t.amount;

        }

    });

    const ctx =
        document
        .getElementById("categoryChart")
        ?.getContext("2d");

    if (!ctx) return;

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels:
                Object.keys(categories),

            datasets: [{

                data:
                    Object.values(categories),

                backgroundColor: [

                    "#00e5ff",
                    "#7c3aed",
                    "#00ff9d",
                    "#ff4d6d",
                    "#facc15",
                    "#38bdf8",
                    "#fb7185",
                    "#22c55e"

                ]

            }]
        },

        options: {

            plugins: {

                legend: {

                    labels: {
                        color: "#ffffff"
                    }

                }

            }

        }

    });

}



/* ==========================
   GOAL SYSTEM
========================== */

const goalNameInput =
    document.getElementById("goalName");

const goalAmountInput =
    document.getElementById("goalAmount");

const saveGoalBtn =
    document.getElementById("saveGoalBtn");

const deleteGoalBtn =
    document.getElementById("deleteGoalBtn");

saveGoalBtn?.addEventListener(
    "click",
    saveGoal
);

deleteGoalBtn?.addEventListener(
    "click",
    deleteGoal
);

function saveGoal() {

    const goal = {

        name:
            goalNameInput.value,

        amount:
            Number(
                goalAmountInput.value
            )

    };

    localStorage.setItem(
        "goal",
        JSON.stringify(goal)
    );

    updateGoalProgress();
}

function deleteGoal() {

    localStorage.removeItem("goal");

    document
        .getElementById("goalText")
        .textContent =
        "No active goal";

    document
        .getElementById("progressFill")
        .style.width = "0%";

    goalPercentEl.textContent = "0%";
}



/* ==========================
   GOAL PROGRESS
========================== */

function updateGoalProgress() {

    const goal =
        JSON.parse(
            localStorage.getItem("goal")
        );

    if (!goal) return;

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {

        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }

    });

    const balance =
        income - expense;

    const percent =
        Math.min(
            100,
            Math.round(
                (balance / goal.amount) * 100
            )
        );

    document
        .getElementById("goalText")
        .textContent =
        `${goal.name} : ₹${balance} / ₹${goal.amount}`;

    document
        .getElementById("progressFill")
        .style.width =
        percent + "%";

    goalPercentEl.textContent =
        percent + "%";

    if (percent >= 100) {

        celebrateGoal();

        saveCompletedGoal(goal);

        localStorage.removeItem("goal");

    }

}



/* ==========================
   CONFETTI
========================== */

function celebrateGoal() {

    confetti({

        particleCount: 200,

        spread: 120,

        origin: {
            y: 0.6
        }

    });

}



/* ==========================
   COMPLETED GOALS
========================== */

function saveCompletedGoal(goal) {

    const completed =
        JSON.parse(
            localStorage.getItem(
                "completedGoals"
            )
        ) || [];

    completed.push({

        name: goal.name,

        amount: goal.amount,

        date:
            new Date()
            .toLocaleDateString()

    });

    localStorage.setItem(
        "completedGoals",
        JSON.stringify(completed)
    );

    localStorage.setItem(
        "goalCompleted",
        "true"
    );

    updateGoalHistory();

    updateBadges();
}

function updateGoalHistory() {

    const historyEl =
        document.getElementById(
            "goalHistory"
        );

    if (!historyEl) return;

    const history =
        JSON.parse(
            localStorage.getItem(
                "completedGoals"
            )
        ) || [];

    historyEl.innerHTML = "";

    history.forEach(goal => {

        historyEl.innerHTML +=

        `
        <li>
            🏆 ${goal.name}
            <br>
            ₹${goal.amount}
            <br>
            <small>${goal.date}</small>
        </li>
        `;

    });

}



/* ==========================
   ACHIEVEMENTS
========================== */

function updateBadges() {

    const badgeContainer =
        document.getElementById(
            "badges"
        );

    if (!badgeContainer) return;

    const badges = [];

    if (
        localStorage.getItem(
            "goalCompleted"
        )
    ) {

        badges.push(
            "🏆 Goal Master"
        );
    }

    if (
        transactions.length >= 10
    ) {

        badges.push(
            "📈 10 Transactions"
        );
    }

    if (
        transactions.length >= 50
    ) {

        badges.push(
            "🚀 Power User"
        );
    }

    if (
        transactions.length >= 100
    ) {

        badges.push(
            "👑 Finance Legend"
        );
    }

    badgeContainer.innerHTML =
        badges.length
        ?
        badges.map(
            badge =>
            `<span class="badge">${badge}</span>`
        ).join("")
        :
        "No achievements yet";

}



/* ==========================
   AI INSIGHTS
========================== */

function updateAIInsights() {

    const insight =
        document.getElementById(
            "aiInsightsText"
        );

    if (!insight) return;

    const expenses =
        transactions.filter(
            t => t.type === "expense"
        );

    if (
        expenses.length === 0
    ) {

        insight.innerHTML =
            "No spending data available.";

        return;
    }

    const categories = {};

    expenses.forEach(t => {

        if (!categories[t.category]) {

            categories[t.category] = 0;

        }

        categories[t.category] += t.amount;

    });

    const topCategory =
        Object.entries(categories)
        .sort(
            (a,b)=>b[1]-a[1]
        )[0];

    const totalSpent =
        expenses.reduce(
            (sum,t)=>
            sum+t.amount,
            0
        );

    insight.innerHTML =

    `
    💸 Highest spending:
    <b>${topCategory[0]}</b>

    <br><br>

    📊 Amount spent:
    ₹${topCategory[1]}

    <br><br>

    🔥 Total expenses:
    ₹${totalSpent}

    <br><br>

    🤖 AI Tip:
    Try reducing spending in
    <b>${topCategory[0]}</b>
    to improve your savings.
    `;
}

/* ==========================
   FINAL INIT
========================== */

updateChart();

loadTransactions();

updateCategoryChart();

updateGoalProgress();

updateGoalHistory();

updateBadges();

updateAIInsights();
