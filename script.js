document.getElementById("showMessageBtn").addEventListener("click", async () => {
    const output = document.getElementById("messageOutput");
    output.textContent = "Loading...";

    try {
        const response = await fetch("https://<your-username>.pythonanywhere.com/api/message");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        output.textContent = data.message;
    } catch (err) {
        output.textContent = "Error fetching message: " + err;
    }
});
