// Add Expense Button
document.getElementById("addExpenseBtn").addEventListener("click", () => {
    const container = document.getElementById("expenseContainer");

    // Prevent creating multiple inputs
    if (!document.getElementById("expenseInput")) {
        const input = document.createElement("input");
        input.type = "text";
        input.id = "expenseInput";
        input.placeholder = "Add amount";  // <-- placeholder text
        input.focus();

        container.appendChild(input);
    }
});
