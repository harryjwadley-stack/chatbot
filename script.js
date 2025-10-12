// Wrap everything in DOMContentLoaded to ensure HTML is loaded
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addExpenseBtn");
    const container = document.getElementById("expenseContainer");

    // Check that the elements exist
    if (!addBtn || !container) {
        console.error("Button or container not found!");
        return;
    }

    addBtn.addEventListener("click", () => {
        // Clear previous input if you want only one
        container.innerHTML = "";

        const input = document.createElement("input");
        input.type = "text";
        input.id = "expenseInput";
        input.placeholder = "Enter amount";

        container.appendChild(input);
        input.focus();
    });
});
