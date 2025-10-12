document.getElementById("showMessageBtn").addEventListener("click", async () => {
    const container = document.getElementById("expenseContainer");

    try {
        // Fetch message from PythonAnywhere
        const response = await fetch("https://harrywadley6.pythonanywhere.com/api/message");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Clear container each time
        container.innerHTML = "";

        // Create a span for the message
        const messageSpan = document.createElement("span");
        messageSpan.textContent = data.message + " "; // add a space before input

        // Create a text input for price
        const priceInput = document.createElement("input");
        priceInput.type = "text";
        priceInput.placeholder = "Enter price";
        priceInput.id = "priceInput";

        // Append both to container
        container.appendChild(messageSpan);
        container.appendChild(priceInput);

        // Focus on the input automatically
        priceInput.focus();

    } catch (err) {
        container.textContent = "Error fetching message: " + err;
    }
});
