/******************************************************
 * Random Number Front-to-Back Script (script.js)
 * Frontend: GitHub Pages
 * Backend:  https://<username>.pythonanywhere.com
 *
 * Requirements in your HTML:
 *   - A button with id="getBtn"
 *   - An output element (e.g. <pre>) with id="getOut"
 ******************************************************/

/* =======================
   1) CONFIGURE THESE
   ======================= */

// Use the **site root** here (not the endpoint)
const API_BASE = "https://harrywadley6.pythonanywhere.com/api/random";

// Endpoint paths (keep simple GET to avoid preflight)
const ENDPOINT_RANDOM = "/api/random";

/* Timeout (ms) for requests */
const FETCH_TIMEOUT_MS = 10000;

/* Optional: turn on to log diagnostics */
const DEBUG = true;


/* =======================
   2) UTILITIES
   ======================= */

// Fetch with timeout helper (no custom headers by default to avoid preflight)
function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const merged = { ...options, signal: controller.signal };
  return fetch(url, merged)
    .finally(() => clearTimeout(id));
}

// Pretty-print errors to the page
function showError(el, err, context = "") {
  const isAbort = err && err.name === "AbortError";
  const msg = isAbort ? "Request timed out" : (err && err.message) || "Unknown error";
  el.textContent = context ? `Error (${context}): ${msg}` : `Error: ${msg}`;
  if (DEBUG) console.error("[fetch error]", context, err);
}

// Quick JSON-safe parse (so we can show body on non-JSON responses)
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    throw new Error(text ? `Non-JSON response: ${text.slice(0, 200)}` : "Non-JSON response");
  }
}


/* =======================
   3) CORE ACTIONS
   ======================= */

async function getRandomNumber(outEl) {
  outEl.textContent = "Loading…";
  const url = `${API_BASE}${ENDPOINT_RANDOM}`;

  try {
    const res = await fetchWithTimeout(url, { method: "GET" });
    if (!res.ok) {
      // Try to read a bit of the body for context
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}${body ? " — " + body.slice(0, 200) : ""}`);
    }

    // Expecting { "value": <int> } from Flask
    const data = await safeJson(res);

    if (!("value" in data)) {
      throw new Error(`Missing "value" in response. Got: ${JSON.stringify(data).slice(0, 200)}`);
    }

    outEl.textContent = `Number: ${data.value}`;
    if (DEBUG) console.log("[success] random value =", data.value);
  } catch (err) {
    showError(outEl, err, "GET /api/random");
  }
}


/* =======================
   4) WIRE UP THE UI
   ======================= */

function bindUI() {
  const btn = document.getElementById("getBtn");
  const out = document.getElementById("getOut");

  if (!btn || !out) {
    console.warn('Missing required elements. Ensure HTML has id="getBtn" and id="getOut".');
    return;
  }

  btn.addEventListener("click", () => getRandomNumber(out));
}

// Ensure DOM is ready before binding
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindUI);
} else {
  bindUI();
}


/* =======================
   5) OPTIONAL: QUICK SELF-TEST
   - Uncomment to log a one-time health poke at page load
   ======================= */
// (async () => {
//   try {
//     const res = await fetchWithTimeout(`${API_BASE}/`, { method: "GET" }, 4000);
//     if (DEBUG) console.log("[health]", res.ok ? "OK" : `HTTP ${res.status}`);
//   } catch (e) {
//     if (DEBUG) console.warn("[health] failed:", e.message);
//   }
// })();
