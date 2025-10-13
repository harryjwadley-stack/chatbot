body {
    font-family: Arial, sans-serif;
    padding: 50px;
    margin: 0;
}

/* Flex container for sidebar + table */
.container {
    display: flex;
    align-items: flex-start; /* align top */
    justify-content: flex-start;
    gap: 50px; /* space between sidebar and table */
}

/* Sidebar on the left */
.sidebar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 200px;
}

/* Add Expense input and dropdown */
#expenseContainer {
    margin-top: 20px;
}

#expenseInput {
    padding: 8px;
    font-size: 16px;
    width: 150px;
    margin-bottom: 10px;
}

#expenseSelect {
    padding: 5px;
    font-size: 16px;
    margin-bottom: 10px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 10px;
}

/* Category totals styling */
#categoryTotals {
    margin-top: 20px;
    font-weight: bold;
}

/* Center the table */
.table-container {
    flex: 1; /* take remaining space */
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Table styling */
#submittedExpenses {
    border-collapse: collapse;
    width: 100%;
    max-width: 600px;
}

#submittedExpenses th,
#submittedExpenses td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
}

#submittedExpenses th {
    background-color: #f2f2f2;
}

#submittedExpenses tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}
