const API_BASE = "https://harrywadley6.pythonanywhere.com/api/random"; // change me

// Small helper to add a timeout to fetch
function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id));
}

// GET example
document.getElementById("getBtn").addEventListener("click", async () => {
  const out = document.getElementById("getOut");
  out.textContent = "Loading…";
  try {
    const res = await fetchWithTimeout(`${API_BASE}`, { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    out.textContent = `Number: ${data.number}`;
  } catch (err) {
    out.textContent = `Error: ${err.name === "AbortError" ? "Request timed out" : err.message}`;
  }
});

// POST example
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const out = document.getElementById("postOut");
  const text = document.getElementById("userText").value.trim();
  if (!text) {
    out.textContent = "Please enter some text";
    return;
  }

  out.textContent = "Sending…";
  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // triggers CORS preflight
      body: JSON.stringify({ user_text: text }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    out.textContent = data.ok ? `Result: ${data.result}` : "Server returned not ok";
  } catch (err) {
    out.textContent = `Error: ${err.name === "AbortError" ? "Request timed out" : err.message}`;
  }
});
