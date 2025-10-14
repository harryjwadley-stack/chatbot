document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const addBtn = document.getElementById("addExpenseBtn");
    const container = document.getElementById("expenseContainer");
    const submittedTableBody = document.getElementById("submittedExpenses").querySelector("tbody");
    const totalsDiv = document.getElementById("categoryTotals");

    const setAllowanceBtn = document.getElementById("setAllowanceBtn");
    const allowanceContainer = document.getElementById("allowanceContainer");
    const allowanceDisplay = document.getElementById("allowanceDisplay");
    const allowanceRemainingDiv = document.getElementById("allowanceRemaining");

    let purchaseCount = 0;
    let currentAllowance = 0;

    const categoryTotals = {
        "Groceries": 0,
        "Social": 0,
        "Treat": 0,
        "Unexpected": 0
    };

    // --- Pie Chart Setup ---
    const ctx = document.getElementById("categoryChart").getContext("2d");
    const categoryChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Groceries", "Social", "Treat", "Unexpected"],
            datasets: [{
                label: "Category Breakdown",
                data: [0, 0, 0, 0],
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { enabled: true }
            }
        }
    });

    // --- Helper Functions ---
    function updateAllowanceRemaining() {
        const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        const remaining = currentAllowance - totalSpent;
        allowanceRemainingDiv.textContent = `Allowance Remaining: ${remaining.toFixed(2)}`;
    }

    function updatePieChart() {
        categoryChart.data.datasets[0].data = [
            categoryTotals["Groceries"],
            categoryTotals["Social"],
            categoryTotals["Treat"],
            categoryTotals["Unexpected"]
        ];
        categoryChart.update();
    }

    // --- Add Expense ---
    addBtn.addEventListener("click", () => {
        container.innerHTML = "";

        const input = document.createElement("input");
        input.type = "number";
        input.step = "0.01";
        input.id = "expenseInput";
        input.placeholder = "Enter amount";

        const select = document.createElement("select");
        select.id = "expenseSelect";
        ["Select", "Groceries", "Social", "Treat", "Unexpected"].forEach(opt => {
            const optionEl = document.createElement("option");
            optionEl.value = opt;
            optionEl.textContent = opt;
            select.appendChild(optionEl);
        });

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit";

        container.appendChild(input);
        container.appendChild(document.createElement("br"));
        container.appendChild(select);
        container.appendChild(document.createElement("br"));
        container.appendChild(submitBtn);

        input.focus();

        submitBtn.addEventListener("click", () => {
            const amount = parseFloat(input.value);
            const category = select.value;

            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }
            if (!categoryTotals.hasOwnProperty(category) || category === "Select") {
                alert("Please select a valid category.");
                return;
            }

            purchaseCount += 1;

            // Add row to table
            const row = document.createElement("tr");
            row.innerHTML = `<td>${purchaseCount}</td><td>${amount.toFixed(2)}</td><td>${category}</td>`;
            submittedTableBody.appendChild(row);

            // Update totals
            categoryTotals[category] += amount;
            totalsDiv.innerHTML = `
                Groceries: ${categoryTotals["Groceries"].toFixed(2)}<br>
                Social: ${categoryTotals["Social"].toFixed(2)}<br>
                Treat: ${categoryTotals["Treat"].toFixed(2)}<br>
                Unexpected: ${categoryTotals["Unexpected"].toFixed(2)}
            `;

            // Update allowance remaining & pie chart
            updateAllowanceRemaining();
            updatePieChart();

            container.innerHTML = "";
        });
    });

    // --- Set Allowance ---
    if (setAllowanceBtn) {
        setAllowanceBtn.addEventListener("click", () => {
            allowanceContainer.innerHTML = "";

            // Create Manual & Calculate buttons
            const manualBtn = document.createElement("button");
            manualBtn.textContent = "Manual";
            const calculateBtn = document.createElement("button");
            calculateBtn.textContent = "Calculate";

            allowanceContainer.appendChild(manualBtn);
            allowanceContainer.appendChild(calculateBtn);

            // --- Manual workflow ---
            function showManualInput() {
                allowanceContainer.innerHTML = "";

                const input = document.createElement("input");
                input.type = "number";
                input.step = "0.01";
                input.id = "allowanceInput";
                input.placeholder = "Enter Allowance amount";

                const submitBtn = document.createElement("button");
                submitBtn.textContent = "Submit Allowance";

                allowanceContainer.appendChild(input);
                allowanceContainer.appendChild(document.createElement("br"));
                allowanceContainer.appendChild(submitBtn);

                input.focus();

                submitBtn.addEventListener("click", () => {
                    const allowance = parseFloat(input.value);
                    if (isNaN(allowance) || allowance <= 0) {
                        alert("Please enter a valid allowance.");
                        return;
                    }

                    currentAllowance = allowance;
                    allowanceDisplay.textContent = `Allowance: ${allowance.toFixed(2)}`;
                    updateAllowanceRemaining();
                    allowanceContainer.innerHTML = "";
                });
            }

            // --- Calculate workflow ---
            function showCalculatedInput() {
                allowanceContainer.innerHTML = "";

                const labels = ["Income", "Rent", "Car Payments", "Bills", "Other", "Ideal Savings"];
                const inputs = {};

                labels.forEach(label => {
                    const labelEl = document.createElement("label");
                    labelEl.textContent = `${label}: `;
                    const inputEl = document.createElement("input");
                    inputEl.type = "number";
                    inputEl.step = "0.01";
                    inputEl.placeholder = label;
                    inputEl.style.display = "block";
                    inputEl.style.marginBottom = "5px";

                    allowanceContainer.appendChild(labelEl);
                    allowanceContainer.appendChild(inputEl);

                    inputs[label] = inputEl;
                });

                const submitBtn = document.createElement("button");
                submitBtn.textContent = "Submit Allowance";
                allowanceContainer.appendChild(submitBtn);

                submitBtn.addEventListener("click", () => {
                    const income = parseFloat(inputs["Income"].value);
                    const rent = parseFloat(inputs["Rent"].value) || 0;
                    const car = parseFloat(inputs["Car Payments"].value) || 0;
                    const bills = parseFloat(inputs["Bills"].value) || 0;
                    const other = parseFloat(inputs["Other"].value) || 0;
                    const savings = parseFloat(inputs["Ideal Savings"].value) || 0;

                    if (isNaN(income) || income <= 0) {
                        alert("Please enter a valid income.");
                        return;
                    }

                    const allowance = income - (rent + car + bills + other + savings);
                    currentAllowance = allowance;
                    allowanceDisplay.textContent = `Allowance: ${allowance.toFixed(2)}`;
                    updateAllowanceRemaining();
                    allowanceContainer.innerHTML = "";
                });
            }

            manualBtn.addEventListener("click", showManualInput);
            calculateBtn.addEventListener("click", showCalculatedInput);
        });
    }
});
