import type { Expense } from '@shared/types'
import '../styles/ExpenseList.css'

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const handleDelete = (id: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      onDelete(id)
    }
  }

  if (expenses.length === 0) {
    return <div className="empty-state">No expenses found</div>
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div key={expense.id} className="expense-card">
          <div className="expense-main">
            <div className="expense-details">
              <h4 className="expense-description">{expense.description}</h4>
              <div className="expense-meta">
                <span className={`expense-badge category-${expense.category}`}>
                  {expense.category}
                </span>
                <span className="expense-date">{formatDate(expense.date)}</span>
              </div>
            </div>
            <div className="expense-amount-section">
              <div className="expense-amount">${parseFloat(expense.amount as any).toFixed(2)}</div>
              <div className="expense-actions">
                <button
                  onClick={() => onEdit(expense)}
                  className="action-btn edit-btn"
                  title="Edit expense"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(expense.id, expense.description)}
                  className="action-btn delete-btn"
                  title="Delete expense"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExpenseList
