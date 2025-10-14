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
            budgetContainer.innerHTML = ""; // clear any previous input

            // Create budget input
            const input = document.createElement("input");
            input.type = "number";
            input.step = "0.01";
            input.id = "budgetInput";
            input.placeholder = "Enter budget amount";

            // Create submit button
            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit Budget";

            // Append input and submit button
            budgetContainer.appendChild(input);
            budgetContainer.appendChild(document.createElement("br")); // ensures button is under input
            budgetContainer.appendChild(submitBtn);

            input.focus();

            // Handle budget submission
            submitBtn.addEventListener("click", () => {
                const budget = parseFloat(input.value);
                if (isNaN(budget) || budget <= 0) {
                    alert("Please enter a valid budget.");
                    return;
                }

                // Update the display element with the new budget
                if (budgetDisplay) {
                    budgetDisplay.textContent = `Budget: ${budget.toFixed(2)}`;
                }

                // Clear the input after submission
                budgetContainer.innerHTML = "";
            });
        });
    }
});