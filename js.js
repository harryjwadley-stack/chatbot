// script.js

// Wait until the HTML is loaded before running this
document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("clickMe");
    const message = document.getElementById("message");

    button.addEventListener("click", function() {
        message.textContent = "You clicked the button! 🎉";
    });
});
