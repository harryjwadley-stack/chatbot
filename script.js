document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addExpenseBtn");
    const container = document.getElementById("expenseContainer");

    addBtn.addEventListener("click", () => {
        if (!document.getElementById("expenseInput")) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = "expenseInput";
            input.placeholder = "Add amount";
            input.focus();
            container.appendChild(input);
        }
    });
});
