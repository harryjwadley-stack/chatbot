document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addExpenseBtn");
    const container = document.getElementById("expenseContainer");
    const submittedTableBody = document.getElementById("submittedExpenses").querySelector("tbody");
    const totalsDiv = document.getElementById("categoryTotals");

    const setBudgetBtn = document.getElementById("setBudgetBtn");
    const budgetContainer = document.getElementById("budgetContainer");
    const budgetDisplay = document.getElementById("budgetDisplay");

    let purchaseCount = 0;

    const categoryTotals = {
        "Groceries": 0,
        "Social": 0,
        "Treat": 0,
        "Unexpected": 0
    };

    // --- Add Expense button ---
    addBtn.addEventListener("click", () => {
        container.innerHTML = "";

        const input = document.createElement("input");
        input.type = "number";
        input.step = "0.01";
        input.id = "expenseInput";
        input.placeholder = "Enter amount";

        const select = document.createElement("select");
        select.id = "expenseSelect";
        const options = ["Select", "Groceries", "Social", "Treat", "Unexpected"];
        options.forEach(opt => {
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

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${purchaseCount}</td>
                <td>${amount.toFixed(2)}</td>
                <td>${category}</td>
            `;
            submittedTableBody.appendChild(row);

            categoryTotals[category] += amount;
            totalsDiv.innerHTML = `
                Groceries: ${categoryTotals["Groceries"].toFixed(2)}<br>
                Social: ${categoryTotals["Social"].toFixed(2)}<br>
                Treat: ${categoryTotals["Treat"].toFixed(2)}<br>
                Unexpected: ${categoryTotals["Unexpected"].toFixed(2)}
            `;

            container.innerHTML = "";
        });
    });

    // --- Set Budget button ---
    if (setBudgetBtn) {
        setBudgetBtn.addEventListener("click", () => {
            budgetContainer.innerHTML = ""; // clear previous inputs

            // Create "Manual" and "Calculate" buttons
            const manualBtn = document.createElement("button");
            manualBtn.textContent = "Manual";
            const calculateBtn = document.createElement("button");
            calculateBtn.textContent = "Calculate";

            budgetContainer.appendChild(manualBtn);
            budgetContainer.appendChild(calculateBtn);

            // --- Manual workflow ---
            function showManualInput() {
                budgetContainer.innerHTML = ""; // remove the two buttons

                const input = document.createElement("input");
                input.type = "number";
                input.step = "0.01";
                input.id = "budgetInput";
                input.placeholder = "Enter budget amount";

                const submitBtn = document.createElement("button");
                submitBtn.textContent = "Submit Budget";

                budgetContainer.appendChild(input);
                budgetContainer.appendChild(document.createElement("br"));
                budgetContainer.appendChild(submitBtn);

                input.focus();

                submitBtn.addEventListener("click", () => {
                    const budget = parseFloat(input.value);
                    if (isNaN(budget) || budget <= 0) {
                        alert("Please enter a valid budget.");
                        return;
                    }

                    budgetDisplay.textContent = `Budget: ${budget.toFixed(2)}`;
                    budgetContainer.innerHTML = "";
                });
            }

            // --- Calculate workflow ---
            function showCalculatedInput() {
                budgetContainer.innerHTML = ""; // remove the two buttons

                const labels = ["Income", "Rent", "Car Payments", "Bills", "Other"];
                const inputs = {};

                labels.forEach(label => {
                    const labelEl = document.createElement("label");
                    labelEl.textContent = `${label}: `;
                    const inputEl = document.createElement("input");
                    inputEl.type = "number";
                    inputEl.step = "0.01";
                    inputEl.placeholder = label;
                    inputEl.style.marginBottom = "5px";
                    inputEl.style.display = "block";

                    budgetContainer.appendChild(labelEl);
                    budgetContainer.appendChild(inputEl);

                    inputs[label] = inputEl;
                });

                const submitBtn = document.createElement("button");
                submitBtn.textContent = "Submit Budget";
                budgetContainer.appendChild(submitBtn);

                submitBtn.addEventListener("click", () => {
                    const income = parseFloat(inputs["Income"].value);
                    const rent = parseFloat(inputs["Rent"].value) || 0;
                    const car = parseFloat(inputs["Car Payments"].value) || 0;
                    const bills = parseFloat(inputs["Bills"].value) || 0;
                    const other = parseFloat(inputs["Other"].value) || 0;

                    if (isNaN(income) || income <= 0) {
                        alert("Please enter a valid income.");
                        return;
                    }

                    const budget = income - (rent + car + bills + other);
                    budgetDisplay.textContent = `Budget: ${budget.toFixed(2)}`;
                    budgetContainer.innerHTML = "";
                });
            }

            // Event listeners for the two buttons
            manualBtn.addEventListener("click", showManualInput);
            calculateBtn.addEventListener("click", showCalculatedInput);
        });
    }
});