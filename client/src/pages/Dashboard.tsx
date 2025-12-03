import { useState, useEffect } from 'react'
import type { Expense, ExpenseStats } from '@shared/types'
import { getExpenses, getStats } from '../services/api'

function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [stats, setStats] = useState<ExpenseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [expensesData, statsData] = await Promise.all([
        getExpenses(),
        getStats(),
      ])
      setExpenses(expensesData)
      setStats(statsData)
      setError(null)
    } catch (err) {
      setError('Failed to load data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="dashboard">Loading...</div>
  }

  if (error) {
    return <div className="dashboard error">{error}</div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>ReTracker</h1>
        <p>Your Personal Expense Tracker</p>
      </header>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Expenses</h3>
            <p className="stat-value">${stats.totalExpenses.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>This Month</h3>
            <p className="stat-value">${stats.monthlyTotal.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Daily Average</h3>
            <p className="stat-value">${stats.averageDaily.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="expenses-section">
        <h2>Recent Expenses</h2>
        {expenses.length === 0 ? (
          <p className="empty-state">No expenses yet. Start tracking your spending!</p>
        ) : (
          <div className="expenses-list">
            {expenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <h4>{expense.description}</h4>
                  <span className="expense-category">{expense.category}</span>
                </div>
                <div className="expense-amount">
                  ${expense.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
