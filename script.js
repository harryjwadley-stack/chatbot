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
const API = "https://harrywadley6.pythonanywhere.com/api/random";

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
   3a) CORE ACTIONS
   ======================= */

async function getRandomNumber(outEl) {
  outEl.textContent = "Loading…";
  const url = API;

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
   3b) CORE ACTIONS – POST
   ======================= */

async function postCalculation(outEl, rawValue) {
  // Basic validation/coercion
  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    outEl.textContent = "Please enter a valid number.";
    return;
  }

  outEl.textContent = "Calculating…";

  // Build the calculate URL based on your existing API constant.
  // If API is like "https://.../api/random", convert to ".../api/calculate".
  let calcUrl;
  try {
    // Handles both trailing slash and no slash
    calcUrl = API.replace(/\/api\/random\/?$/i, "/api/calculate");
  } catch {
    // Fallback if API isn't the random endpoint
    calcUrl = API.endsWith("/") ? API + "api/calculate" : API + "/api/calculate";
  }

  try {
    const res = await fetchWithTimeout(calcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value })
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}${body ? " — " + body.slice(0, 200) : ""}`);
    }

    // Expecting e.g. { "input": <number>, "result": <number> }
    const data = await safeJson(res);

    if (!("result" in data)) {
      throw new Error(`Missing "result" in response. Got: ${JSON.stringify(data).slice(0, 200)}`);
    }

    outEl.textContent = `Result for ${"input" in data ? data.input : value}: ${data.result}`;
    if (DEBUG) console.log("[success] calc =", data);
  } catch (err) {
    showError(outEl, err, "POST /api/calculate");
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

document.getElementById("calcBtn")?.addEventListener("click", () => {
  const inputEl = document.getElementById("userNumber");
  const outEl   = document.getElementById("calcOut");
  postCalculation(outEl, inputEl.value);
});



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
