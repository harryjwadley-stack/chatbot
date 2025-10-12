document.getElementById("showMessageBtn").addEventListener("click", async () => {
    const container = document.getElementById("messageOutput");

    // Clear previous content
    container.innerHTML = "";

    // Create a span for the message
    const messageSpan = document.createElement("span");

    // Create the input for price
    const priceInput = document.createElement("input");
    priceInput.type = "text";
    priceInput.placeholder = "Enter price";
    priceInput.id = "priceInput";

    // Append the elements immediately so the user sees the input
    container.appendChild(messageSpan);
    container.appendChild(priceInput);
    priceInput.focus();

    // Fetch the message from PythonAnywhere
    try {
        const response = await fetch("https://harrywadley6.pythonanywhere.com/api/message");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        messageSpan.textContent = data.message + " "; // display "expensy"
    } catch (err) {
        messageSpan.textContent = "Error fetching message ";
    }
});
