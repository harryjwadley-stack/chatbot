document.addEventListener("DOMContentLoaded", () => {
  // ===== Grab elements =====
  const addBtn = document.getElementById("addExpenseBtn");
  const container = document.getElementById("expenseContainer");
  const submittedTableBody = document.getElementById("submittedExpenses").querySelector("tbody");
  const totalsDiv = document.getElementById("categoryTotals");

  const setAllowanceBtn = document.getElementById("setAllowanceBtn");
  const allowanceContainer = document.getElementById("allowanceContainer");
  const allowanceDisplay = document.getElementById("allowanceDisplay");
  const allowanceRemainingDiv = document.getElementById("allowanceRemaining");

  // Month controls
  const prevBtn = document.getElementById("prevMonthBtn");
  const nextBtn = document.getElementById("nextMonthBtn");
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // ===== Chart.js setup =====
  const ctx = document.getElementById("categoryChart").getContext("2d");
  const categoryChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Groceries", "Social", "Treat", "Unexpected"],
      datasets: [{
        label: "Category Breakdown",
        data: [0, 0, 0, 0],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { enabled: true }
      }
    }
  });

  // ===== Storage & month state =====
  const STORAGE_KEY = "savr-monthly-state-v1";

  function yyyymmKey(y, mIndex) {
    // mIndex: 0..11
    return `${y}-${String(mIndex + 1).padStart(2, "0")}`;
  }

  // monthlyState shape:
  // {
  //   "2025-01": {
  //     allowance: number,
  //     expenses: Array<{id:number, amount:number, category:string}>,
  //     categoryTotals: {Groceries:number, Social:number, Treat:number, Unexpected:number},
  //     purchaseCount: number
  //   },
  //   ...
  // }
  let monthlyState = loadState();
  let currentYear, currentMonthIndex; // 0..11

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(monthlyState));
  }
  function ensureMonth(key) {
    if (!monthlyState[key]) {
      monthlyState[key] = {
        allowance: 0,
        expenses: [],
        categoryTotals: { Groceries: 0, Social: 0, Treat: 0, Unexpected: 0 },
        purchaseCount: 0
      };
    }
    return monthlyState[key];
  }
  function currentKey() {
    return yyyymmKey(currentYear, currentMonthIndex);
  }
  function getMonthData() {
    return ensureMonth(currentKey());
  }

  // ===== Init month pickers =====
  (function initMonthYearPickers() {
    if (!monthSelect || !yearSelect) return; // safety if controls not present

    const now = new Date();
    currentYear = now.getFullYear();
    currentMonthIndex = now.getMonth();

    // Months
    monthNames.forEach((name, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = name;
      monthSelect.appendChild(opt);
    });

    // Years (±3 years)
    const startYear = currentYear - 3;
    const endYear   = currentYear + 3;
    for (let y = startYear; y <= endYear; y++) {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    }

    monthSelect.value = currentMonthIndex;
    yearSelect.value = currentYear;

    monthSelect.addEventListener("change", () => {
      currentMonthIndex = Number(monthSelect.value);
      renderForCurrentMonth();
    });
    yearSelect.addEventListener("change", () => {
      currentYear = Number(yearSelect.value);
      renderForCurrentMonth();
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentMonthIndex--;
        if (currentMonthIndex < 0) {
          currentMonthIndex = 11;
          currentYear--;
          if (yearSelect) yearSelect.value = currentYear;
        }
        if (monthSelect) monthSelect.value = currentMonthIndex;
        renderForCurrentMonth();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentMonthIndex++;
        if (currentMonthIndex > 11) {
          currentMonthIndex = 0;
          currentYear++;
          if (yearSelect) yearSelect.value = currentYear;
        }
        if (monthSelect) monthSelect.value = currentMonthIndex;
        renderForCurrentMonth();
      });
    }
  })();

  // If controls were missing, still set sensible defaults
  if (currentYear === undefined || currentMonthIndex === undefined) {
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonthIndex = now.getMonth();
  }

  // ===== Render helpers =====
  function updateAllowanceRemaining() {
    const data = getMonthData();
    const totalSpent = Object.values(data.categoryTotals).reduce((sum, val) => sum + val, 0);
    const remaining = data.allowance - totalSpent;
    allowanceRemainingDiv.textContent = `Allowance Remaining: ${remaining.toFixed(2)}`;
  }

  function updatePieChart() {
    const data = getMonthData();
    categoryChart.data.datasets[0].data = [
      data.categoryTotals.Groceries,
      data.categoryTotals.Social,
      data.categoryTotals.Treat,
      data.categoryTotals.Unexpected
    ];
    categoryChart.update();
  }

  function renderForCurrentMonth() {
    const data = getMonthData();

    // Allowance display
    allowanceDisplay.textContent = `Allowance: ${data.allowance.toFixed(2)}`;

    // Table
    submittedTableBody.innerHTML = "";
    data.expenses.forEach((e, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${idx + 1}</td><td>${e.amount.toFixed(2)}</td><td>${e.category}</td>`;
      submittedTableBody.appendChild(row);
    });

    // Totals
    totalsDiv.innerHTML = `
      Groceries: ${data.categoryTotals.Groceries.toFixed(2)}<br>
      Social: ${data.categoryTotals.Social.toFixed(2)}<br>
      Treat: ${data.categoryTotals.Treat.toFixed(2)}<br>
      Unexpected: ${data.categoryTotals.Unexpected.toFixed(2)}
    `;

    // Remaining + chart
    updateAllowanceRemaining();
    updatePieChart();
  }

  // ===== Add Expense =====
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      container.innerHTML = "";

      const input = document.createElement("input");
      input.type = "number";
      input.step = "0.01";
      input.min = "0.01";
      input.id = "expenseInput";
      input.placeholder = "Enter amount";

      const select = document.createElement("select");
      select.id = "expenseSelect";
      ["Select", "Groceries", "Social", "Treat", "Unexpected"].forEach(opt => {
        const optionEl = document.createElement("option");
        optionEl.value = opt;
        optionEl.textContent = opt;
        select.appendChild(optionEl);
      });

      const submitBtn = document.createElement("button");
      submitBtn.type = "button";
      submitBtn.textContent = "Submit";

      container.appendChild(input);
      container.appendChild(document.createElement("br"));
      container.appendChild(select);
      container.appendChild(document.createElement("br"));
      container.appendChild(submitBtn);

      input.focus();

      submitBtn.addEventListener("click", () => {
        const amount = parseFloat(input.value);
        const category = select.value;

        if (isNaN(amount) || amount <= 0) {
          alert("Please enter a valid amount.");
          return;
        }
        if (!["Groceries", "Social", "Treat", "Unexpected"].includes(category)) {
          alert("Please select a valid category.");
          return;
        }

        const data = getMonthData();
        data.purchaseCount += 1;
        data.expenses.push({ id: data.purchaseCount, amount, category });
        data.categoryTotals[category] += amount;

        saveState();
        renderForCurrentMonth();
        container.innerHTML = "";
      });
    });
  }

  // ===== Set Allowance (Manual / Calculate) =====
  if (setAllowanceBtn) {
    setAllowanceBtn.addEventListener("click", () => {
      allowanceContainer.innerHTML = "";

      // Buttons
      const manualBtn = document.createElement("button");
      manualBtn.type = "button";
      manualBtn.textContent = "Manual";

      const calculateBtn = document.createElement("button");
      calculateBtn.type = "button";
      calculateBtn.textContent = "Calculate";

      allowanceContainer.appendChild(manualBtn);
      allowanceContainer.appendChild(calculateBtn);

      function showManualInput() {
        allowanceContainer.innerHTML = "";

        const input = document.createElement("input");
        input.type = "number";
        input.step = "0.01";
        input.min = "0"; // allow 0
        input.id = "allowanceInput";
        input.placeholder = "Enter Allowance amount";
        input.value = 0;

        const submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.textContent = "Submit Allowance";

        allowanceContainer.appendChild(input);
        allowanceContainer.appendChild(document.createElement("br"));
        allowanceContainer.appendChild(submitBtn);

        input.focus();

        submitBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          const allowance = parseFloat(input.value);
          if (isNaN(allowance)) {
            alert("Please enter a valid allowance (0 or more).");
            return;
          }

          const data = getMonthData();
          data.allowance = allowance;

          saveState();
          renderForCurrentMonth();
          allowanceContainer.innerHTML = "";
        });
      }

      function showCalculatedInput() {
        allowanceContainer.innerHTML = "";

        const labels = ["Income", "Rent", "Car Payments", "Bills", "Ideal Savings", "Other"];
        const inputs = {};

        labels.forEach(label => {
          const labelEl = document.createElement("label");
          labelEl.textContent = `${label}: `;
          const inputEl = document.createElement("input");
          inputEl.type = "number";
          inputEl.step = "0.01";
          inputEl.min = "0";
          inputEl.placeholder = label;
          inputEl.style.display = "block";
          inputEl.style.marginBottom = "5px";
          inputEl.value = 0;

          allowanceContainer.appendChild(labelEl);
          allowanceContainer.appendChild(inputEl);

          inputs[label] = inputEl;
        });

        const submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.textContent = "Submit Allowance";
        allowanceContainer.appendChild(submitBtn);

        submitBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          const income  = parseFloat(inputs["Income"].value) || 0;
          const rent    = parseFloat(inputs["Rent"].value) || 0;
          const car     = parseFloat(inputs["Car Payments"].value) || 0;
          const bills   = parseFloat(inputs["Bills"].value) || 0;
          const savings = parseFloat(inputs["Ideal Savings"].value) || 0;
          const other   = parseFloat(inputs["Other"].value) || 0;

          const allowance = income - (rent + car + bills + savings + other);

          const data = getMonthData();
          data.allowance = allowance;

          saveState();
          renderForCurrentMonth();
          allowanceContainer.innerHTML = "";
        });
      }

      manualBtn.addEventListener("click", showManualInput);
      calculateBtn.addEventListener("click", showCalculatedInput);
    });
  }

  // ===== Initial render =====
  renderForCurrentMonth();
});
