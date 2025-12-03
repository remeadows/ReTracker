import { useState, useEffect, useMemo } from 'react'
import type { Expense, ExpenseStats, CreateExpenseDto } from '@shared/types'
import { getExpenses, getStats, createExpense, updateExpense, deleteExpense } from '../services/api'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseFilters, { type FilterOptions } from '../components/ExpenseFilters'
import ExpenseList from '../components/ExpenseList'
import ExportMenu from '../components/ExportMenu'
import CategoryChart from '../components/CategoryChart'
import MonthlyTrendChart from '../components/MonthlyTrendChart'

function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [stats, setStats] = useState<ExpenseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>()
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'all',
    dateFrom: '',
    dateTo: '',
  })

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

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          expense.description.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.category !== 'all' && expense.category !== filters.category) {
        return false
      }

      // Date range filter
      const expenseDate = new Date(expense.date).setHours(0, 0, 0, 0)
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom).setHours(0, 0, 0, 0)
        if (expenseDate < fromDate) return false
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo).setHours(0, 0, 0, 0)
        if (expenseDate > toDate) return false
      }

      return true
    })
  }, [expenses, filters])

  const handleAddExpense = () => {
    setEditingExpense(undefined)
    setShowForm(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleFormSubmit = async (data: CreateExpenseDto) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, data)
      } else {
        await createExpense(data)
      }
      await loadData()
      setShowForm(false)
      setEditingExpense(undefined)
    } catch (err) {
      throw err
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id)
      await loadData()
    } catch (err) {
      console.error('Failed to delete expense:', err)
      alert('Failed to delete expense. Please try again.')
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingExpense(undefined)
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
        <button className="add-expense-btn" onClick={handleAddExpense}>
          + Add Expense
        </button>
      </header>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Expenses</h3>
            <p className="stat-value">${parseFloat(stats.totalExpenses as any).toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>This Month</h3>
            <p className="stat-value">${parseFloat(stats.monthlyTotal as any).toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Daily Average</h3>
            <p className="stat-value">${parseFloat(stats.averageDaily as any).toFixed(2)}</p>
          </div>
        </div>
      )}

      {expenses.length > 0 && (
        <div className="charts-grid">
          <CategoryChart expenses={expenses} />
          <MonthlyTrendChart expenses={expenses} />
        </div>
      )}

      <ExpenseFilters filters={filters} onFilterChange={setFilters} />

      <div className="expenses-section">
        <div className="section-header">
          <h2>
            {filters.search || filters.category !== 'all' || filters.dateFrom || filters.dateTo
              ? 'Filtered Expenses'
              : 'All Expenses'}
          </h2>
          <span className="expense-count">
          <ExportMenu expenses={filteredExpenses} />
            {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
          </span>
        </div>
        {expenses.length === 0 ? (
          <div className="empty-state-container">
            <p className="empty-state">No expenses yet. Start tracking your spending!</p>
            <button className="add-expense-btn-large" onClick={handleAddExpense}>
              + Add Your First Expense
            </button>
          </div>
        ) : (
          <ExpenseList
            expenses={filteredExpenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        )}
      </div>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
}

export default Dashboard
