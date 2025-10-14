document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addExpenseBtn");
    const container = document.getElementById("expenseContainer");
    const submittedTableBody = document.getElementById("submittedExpenses").querySelector("tbody");
    const totalsDiv = document.getElementById("categoryTotals");

    // Set Budget elements
    const setBudgetBtn = document.getElementById("setBudgetBtn");
    const budgetContainer = document.getElementById("budgetContainer");

    let purchaseCount = 0;

    // Running totals per category
    const categoryTotals = {
        "Groceries": 0,
        "Social": 0,
        "Treat": 0,
        "Unexpected": 0
    };

    // --- Add Expense button functionality ---
    addBtn.addEventListener("click", () => {
        container.innerHTML = ""; // clear previous inputs

        // Create expense input
        const input = document.createElement("input");
        input.type = "number";
        input.step = "0.01";
        input.id = "expenseInput";
        input.placeholder = "Enter amount";

        // Create category dropdown
        const select = document.createElement("select");
        select.id = "expenseSelect";
        const options = ["Select", "Groceries", "Social", "Treat", "Unexpected"];
        options.forEach(opt => {
            const optionEl = document.createElement("option");
            optionEl.value = opt;
            optionEl.textContent = opt;
            select.appendChild(optionEl);
        });

        // Create submit button
        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit";

        // Append elements to container
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

            // Add a new row to the submitted expenses table
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${purchaseCount}</td>
                <td>${amount.toFixed(2)}</td>
                <td>${category}</td>
            `;
            submittedTableBody.appendChild(row);

            // Update category totals
            categoryTotals[category] += amount;
            totalsDiv.innerHTML = `
                Groceries: ${categoryTotals["Groceries"].toFixed(2)}<br>
                Social: ${categoryTotals["Social"].toFixed(2)}<br>
                Treat: ${categoryTotals["Treat"].toFixed(2)}<br>
                Unexpected: ${categoryTotals["Unexpected"].toFixed(2)}
            `;

            container.innerHTML = ""; // clear input + dropdown + submit
        });
    });

    // --- Set Budget button functionality ---
    if (setBudgetBtn) {
        setBudgetBtn.addEventListener("click", () => {
            budgetContainer.innerHTML = ""; // clear previous inputs

            // Create budget input
            const input = document.createElement("input");
            input.type = "number";
            input.step = "0.01";
            input.id = "budgetInput";
            input.placeholder = "Enter budget amount";

            // Create submit button
            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit Budget";

            // Append input first, then button underneath
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

                alert(`Budget set to ${budget.toFixed(2)}`);
                budgetContainer.innerHTML = ""; // clear after submission
            });
        });
    }
});
