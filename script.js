document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addExpenseBtn");
    const container = document.getElementById("expenseContainer");

    addBtn.addEventListener("click", () => {
        // Clear previous content if you want only one row
        container.innerHTML = "";

        // Create the text input
        const input = document.createElement("input");
        input.type = "text";
        input.id = "expenseInput";
        input.placeholder = "Enter amount";

        // Create the dropdown menu
        const select = document.createElement("select");
        select.id = "expenseSelect";

        const options = ["A", "B", "C", "D"];
        options.forEach(opt => {
            const optionEl = document.createElement("option");
            optionEl.value = opt;
            optionEl.textContent = opt;
            select.appendChild(optionEl);
        });

        // Append both elements to the container
        container.appendChild(input);
        container.appendChild(document.createElement("br")); // line break
        container.appendChild(select);

        input.focus(); // focus the text input automatically
    });
});
