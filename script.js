document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addExpenseBtn");
    const container = document.getElementById("expenseContainer");
    const submitted = document.getElementById("submittedExpenses");

    addBtn.addEventListener("click", () => {
        // Clear previous elements (optional, or you could allow multiple rows)
        container.innerHTML = "";

        // Create text input
        const input = document.createElement("input");
        input.type = "text";
        input.id = "expenseInput";
        input.placeholder = "Enter amount";

        // Create dropdown
        const select = document.createElement("select");
        select.id = "expenseSelect";
        const options = ["A", "B", "C", "D"];
        options.forEach(opt => {
            const optionEl = document.createElement("option");
            optionEl.value = opt;
            optionEl.textContent = opt;
            select.appendChild(optionEl);
        });

        // Create Submit button
        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit";

        // Append elements
        container.appendChild(input);
        container.appendChild(document.createElement("br"));
        container.appendChild(select);
        container.appendChild(document.createElement("br"));
        container.appendChild(submitBtn);

        input.focus();

        // Handle Submit button click
        submitBtn.addEventListener("click", () => {
            const amount = input.value.trim();
            const category = select.value;

            if (amount === "") {
                alert("Please enter an amount.");
                return;
            }

            // Display submitted expense
            const expenseText = document.createElement("p");
            expenseText.textContent = `Amount: ${amount}, Category: ${category}`;
            submitted.appendChild(expenseText);

            // Optionally clear inputs
            input.value = "";
            select.selectedIndex = 0;
        });
    });
});
