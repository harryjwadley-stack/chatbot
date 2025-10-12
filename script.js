// --- Show message from PythonAnywhere ---
document.getElementById("showMessageBtn").addEventListener("click", async () => {
    const output = document.getElementById("messageOutput");
    output.textContent = "Loading...";

    try {
        const response = await fetch("https://harrywadley6.pythonanywhere.com/api/message");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        output.textContent = data.message;
    } catch (err) {
        output.textContent = "Error fetching message: " + err;
    }
});

// --- Add Expense Button ---
document.getElementById("addExpenseBtn").addEventListener("click", () => {
    const container = document.getElementById("expenseContainer");

    // Check if input already exists
    if (!document.getElementById("expenseInput")) {
        const input = document.createElement("input");
        input.type = "text";
        input.id = "expenseInput";
        input.placeholder = "Enter expense";

        // Optional: auto-focus when created
        input.focus();

        container.appendChild(input);
    }
});
