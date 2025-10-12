document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addExpenseBtn");
    const container = document.getElementById("expenseContainer");

    addBtn.addEventListener("click", () => {
        // Prevent multiple inputs
        if (!document.getElementById("expenseInput")) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = "expenseInput";
            input.placeholder = "Enter amount";
            container.appendChild(input);
            input.focus();
        }
    });
});
