import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import type { Income, CreateIncomeDto, BudgetSummary } from '@shared/types'
import { getIncome, createIncome, updateIncome, deleteIncome, getBudgetSummary } from '../services/api'
import IncomeForm from './IncomeForm'
import '../styles/BudgetDashboard.css'

function BudgetDashboard() {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | undefined>(undefined)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [incomesData, summaryData] = await Promise.all([
        getIncome(),
        getBudgetSummary(),
      ])
      setIncomes(incomesData)
      setBudgetSummary(summaryData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budget data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddIncome = () => {
    setEditingIncome(undefined)
    setShowForm(true)
  }

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingIncome(undefined)
  }

  const handleSubmitIncome = async (data: CreateIncomeDto) => {
    try {
      if (editingIncome) {
        await updateIncome(editingIncome.id, data)
        toast.success('Income updated successfully!')
      } else {
        await createIncome(data)
        toast.success('Income added successfully!')
      }
      await fetchData()
      handleCloseForm()
    } catch (err) {
      throw err
    }
  }

  const handleDeleteIncome = async (id: string) => {
    // Use toast.promise for better UX
    toast.promise(
      deleteIncome(id).then(() => fetchData()),
      {
        loading: 'Deleting income...',
        success: 'Income deleted successfully!',
        error: 'Failed to delete income',
      }
    ).catch((err) => {
      console.error('Delete failed:', err)
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="budget-dashboard">
        <div className="loading">Loading budget data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="budget-dashboard">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="budget-dashboard">
      <div className="dashboard-header">
        <h1>Budget Overview</h1>
      </div>

      {budgetSummary && (
        <div className="budget-summary">
          <div className="summary-cards">
            <div className="summary-card highlight">
              <div className="card-label">Net Monthly Income</div>
              <div className="card-value">{formatCurrency(budgetSummary.netMonthly)}</div>
              <div className="card-sublabel">
                After expenses
              </div>
            </div>

            <div className="summary-card">
              <div className="card-label">Monthly Income</div>
              <div className="card-value positive">{formatCurrency(budgetSummary.monthlyIncome)}</div>
              <div className="card-sublabel">
                {formatCurrency(budgetSummary.yearlyIncome)} yearly (net of taxes)
              </div>
            </div>

            <div className="summary-card">
              <div className="card-label">Monthly Expenses</div>
              <div className="card-value negative">{formatCurrency(budgetSummary.monthlyExpenses)}</div>
              <div className="card-sublabel">
                {formatCurrency(budgetSummary.yearlyExpenses)} yearly (projected)
              </div>
            </div>

            <div className="summary-card">
              <div className="card-label">Savings Rate</div>
              <div className="card-value">{formatPercent(budgetSummary.savingsRate)}</div>
              <div className="card-sublabel">
                Of net income
              </div>
            </div>
          </div>

          <div className="budget-breakdown">
            <div className="breakdown-section">
              <h3>Yearly Summary</h3>
              <div className="breakdown-row">
                <span className="breakdown-label">Total Income (net of taxes)</span>
                <span className="breakdown-value positive">{formatCurrency(budgetSummary.yearlyIncome)}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label">Total Expenses (projected)</span>
                <span className="breakdown-value negative">-{formatCurrency(budgetSummary.yearlyExpenses)}</span>
              </div>
              <div className="breakdown-row total">
                <span className="breakdown-label">Net Income</span>
                <span className="breakdown-value">{formatCurrency(budgetSummary.netIncome)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="income-section">
        <div className="section-header">
          <h2>Income Sources</h2>
          <button className="btn-primary" onClick={handleAddIncome}>
            + Add Income
          </button>
        </div>

        {incomes.length === 0 ? (
          <div className="empty-state">
            <p>No income sources added yet.</p>
            <p className="text-muted">Add your salary or hourly income to see your budget summary.</p>
          </div>
        ) : (
          <div className="income-list">
            {incomes.map((income) => {
              const amount = parseFloat(income.amount as any)
              const taxRate = parseFloat(income.taxRate as any)
              return (
                <div key={income.id} className="income-item">
                  <div className="income-main">
                    <div className="income-info">
                      <h3>{income.description}</h3>
                      <div className="income-details">
                        <span className="income-badge">
                          {income.incomeType === 'salary'
                            ? `${income.payFrequency} salary`
                            : `$${amount.toFixed(2)}/hr × ${income.hoursPerWeek}hrs/week`}
                        </span>
                        <span className="income-tax">Tax: {formatPercent(taxRate)}</span>
                      </div>
                    </div>
                    <div className="income-amount">
                      {formatCurrency(amount)}
                      <span className="amount-label">
                        {income.incomeType === 'salary' ? 'per period' : 'per hour'}
                      </span>
                    </div>
                  </div>
                  <div className="income-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEditIncome(income)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteIncome(income.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <IncomeForm
          income={editingIncome}
          onSubmit={handleSubmitIncome}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  )
}

export default BudgetDashboard
