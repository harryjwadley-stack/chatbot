document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addExpenseBtn");
    const container = document.getElementById("expenseContainer");
    const submittedTableBody = document.getElementById("submittedExpenses").querySelector("tbody");
    const totalsDiv = document.getElementById("categoryTotals");

    const setAllowanceBtn = document.getElementById("setAllowanceBtn");
    const AllowanceContainer = document.getElementById("AllowanceContainer");
    const AllowanceDisplay = document.getElementById("AllowanceDisplay");
    const AllowanceRemainingDiv = document.getElementById("AllowanceRemaining"); // NEW

    let purchaseCount = 0;
    let currentAllowance = 0; // track current Allowance

    const categoryTotals = {
        "Groceries": 0,
        "Social": 0,
        "Treat": 0,
        "Unexpected": 0
    };

    // Function to update Allowance Remaining
    function updateAllowanceRemaining() {
        const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        const remaining = currentAllowance - totalSpent;
        AllowanceRemainingDiv.textContent = `Allowance Remaining: ${remaining.toFixed(2)}`;
    }

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

            // Update Allowance Remaining
            updateAllowanceRemaining();

            container.innerHTML = "";
        });
    });

    // --- Set Allowance button ---
    if (setAllowanceBtn) {
        setAllowanceBtn.addEventListener("click", () => {
            AllowanceContainer.innerHTML = ""; // clear previous inputs

            // Create "Manual" and "Calculate" buttons
            const manualBtn = document.createElement("button");
            manualBtn.textContent = "Manual";
            const calculateBtn = document.createElement("button");
            calculateBtn.textContent = "Calculate";

            AllowanceContainer.appendChild(manualBtn);
            AllowanceContainer.appendChild(calculateBtn);

            // --- Manual workflow ---
            function showManualInput() {
                AllowanceContainer.innerHTML = ""; // remove the two buttons

                const input = document.createElement("input");
                input.type = "number";
                input.step = "0.01";
                input.id = "AllowanceInput";
                input.placeholder = "Enter Allowance amount";

                const submitBtn = document.createElement("button");
                submitBtn.textContent = "Submit Allowance";

                AllowanceContainer.appendChild(input);
                AllowanceContainer.appendChild(document.createElement("br"));
                AllowanceContainer.appendChild(submitBtn);

                input.focus();

                submitBtn.addEventListener("click", () => {
                    const Allowance = parseFloat(input.value);
                    if (isNaN(Allowance) || Allowance <= 0) {
                        alert("Please enter a valid Allowance.");
                        return;
                    }

                    currentAllowance = Allowance;
                    AllowanceDisplay.textContent = `Allowance: ${Allowance.toFixed(2)}`;
                    updateAllowanceRemaining();
                    AllowanceContainer.innerHTML = "";
                });
            }

            // --- Calculate workflow ---
            function showCalculatedInput() {
                AllowanceContainer.innerHTML = "";

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

                    AllowanceContainer.appendChild(labelEl);
                    AllowanceContainer.appendChild(inputEl);

                    inputs[label] = inputEl;
                });

                const submitBtn = document.createElement("button");
                submitBtn.textContent = "Submit Allowance";
                AllowanceContainer.appendChild(submitBtn);

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

                    const Allowance = income - (rent + car + bills + other);
                    currentAllowance = Allowance;
                    AllowanceDisplay.textContent = `Allowance: ${Allowance.toFixed(2)}`;
                    updateAllowanceRemaining();
                    AllowanceContainer.innerHTML = "";
                });
            }

            manualBtn.addEventListener("click", showManualInput);
            calculateBtn.addEventListener("click", showCalculatedInput);
        });
    }
});
