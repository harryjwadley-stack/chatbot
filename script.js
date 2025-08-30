const API_BASE = "https://harrywadley6.pythonanywhere.com/api/random"; // full endpoint

// Small helper to add a timeout to fetch
function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
}

// GET example
document.getElementById("getBtn").addEventListener("click", async () => {
  const out = document.getElementById("getOut");
  out.textContent = "Loading…";
  try {
    const res = await fetchWithTimeout(API_BASE, { method: "GET" }); // <-- no extra /api/random
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}${text ? " — " + text.slice(0,200) : ""}`);
    }
    const data = await res.json();
    out.textContent = `Number: ${data.value}`; // <-- use "value"
  } catch (err) {
    out.textContent = `Error: ${err.name === "AbortError" ? "Request timed out" : err.message}`;
    console.error("Fetch error:", err);
  }
});

// (Optional) Remove or disable POST until you implement the backend route with CORS
