document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addExpenseBtn");
    const container = document.getElementById("expenseContainer");
    const submitted = document.getElementById("submittedExpenses");
    const totalsDiv = document.getElementById("categoryTotals");

    // Counter for purchases
    let purchaseCount = 0;

    // Running totals for each category
    const categoryTotals = {
        "Groceries": 0,
        "Social": 0,
        "Treat": 0,
        "Unexpected": 0
    };

    addBtn.addEventListener("click", () => {
        container.innerHTML = "";

        // Create text input for amount
        const input = document.createElement("input");
        input.type = "number";
        input.step = "0.01";
        input.id = "expenseInput";
        input.placeholder = "Enter amount";

        // Create dropdown for category
        const select = document.createElement("select");
        select.id = "expenseSelect";
        const options = ["Select", "Groceries", "Social", "Treat", "Unexpected"];
        options.forEach(opt => {
            const optionEl = document.createElement("option");
            optionEl.value = opt;
            optionEl.textContent = opt;
            select.appendChild(optionEl);
        });

        // Create Submit button
        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit";

        // Append to container
        container.appendChild(input);
        container.appendChild(document.createElement("br"));
        container.appendChild(select);
        container.appendChild(document.createElement("br"));
        container.appendChild(submitBtn);

        input.focus();

        // Handle Submit button click
        submitBtn.addEventListener("click", () => {
            const amount = parseFloat(input.value.trim());
            const category = select.value;

            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }

            if (category === "Select") {
                alert("Please select a category.");
                return;
            }

            // Increment purchase count
            purchaseCount += 1;

            // Display submitted expense
            const expenseText = document.createElement("p");
            expenseText.textContent = `Purchase #${purchaseCount}: Amount: ${amount.toFixed(2)}, Category: ${category}`;
            submitted.appendChild(expenseText);

            // Update running totals
            categoryTotals[category] += amount;

            // Update category totals display
            totalsDiv.innerHTML = `
                Groceries: ${categoryTotals["Groceries"].toFixed(2)}<br>
                Social: ${categoryTotals["Social"].toFixed(2)}<br>
                Treat: ${categoryTotals["Treat"].toFixed(2)}<br>
                Unexpected: ${categoryTotals["Unexpected"].toFixed(2)}
            `;

            // Clear the input/dropdown
            container.innerHTML = "";
        });
    });
});
