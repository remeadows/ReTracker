import type { Expense } from '@shared/types'

export function exportToCSV(expenses: Expense[], filename: string = 'expenses.csv') {
  if (expenses.length === 0) {
    alert('No expenses to export')
    return
  }

  // Create CSV header
  const headers = ['Date', 'Description', 'Category', 'Amount']

  // Create CSV rows
  const rows = expenses.map((expense) => [
    new Date(expense.date).toLocaleDateString(),
    `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes
    expense.category,
    expense.amount.toFixed(2),
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export function printExpenses(expenses: Expense[]) {
  if (expenses.length === 0) {
    alert('No expenses to print')
    return
  }

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to print')
    return
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>ReTracker - Expense Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          color: #4f46e5;
          border-bottom: 2px solid #4f46e5;
          padding-bottom: 10px;
        }
        .meta {
          color: #6b7280;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #111827;
        }
        .amount {
          text-align: right;
          font-weight: 600;
        }
        .category {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          background-color: #e5e7eb;
        }
        .total-row {
          font-weight: bold;
          font-size: 1.125rem;
          background-color: #f9fafb;
        }
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <h1>ReTracker - Expense Report</h1>
      <div class="meta">
        <p>Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
        <p>Total Expenses: ${expenses.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${expenses
            .map(
              (expense) => `
            <tr>
              <td>${new Date(expense.date).toLocaleDateString()}</td>
              <td>${expense.description}</td>
              <td><span class="category">${expense.category}</span></td>
              <td class="amount">$${expense.amount.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
          <tr class="total-row">
            <td colspan="3">Total</td>
            <td class="amount">$${totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}
