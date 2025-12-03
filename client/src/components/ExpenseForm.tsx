import { useState, useEffect } from 'react'
import type { Expense, CreateExpenseDto, ExpenseCategory } from '@shared/types'
import '../styles/ExpenseForm.css'

interface ExpenseFormProps {
  expense?: Expense
  onSubmit: (data: CreateExpenseDto) => Promise<void>
  onCancel: () => void
}

const categories: ExpenseCategory[] = [
  'food',
  'transport',
  'entertainment',
  'utilities',
  'healthcare',
  'shopping',
  'other',
]

function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState<CreateExpenseDto>({
    amount: expense?.amount || 0,
    description: expense?.description || '',
    category: expense?.category || 'other',
    date: expense?.date || new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        date: expense.date.split('T')[0],
      })
    }
  }, [expense])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (formData.amount <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save expense')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }))
  }

  return (
    <div className="expense-form-overlay">
      <div className="expense-form-container">
        <div className="expense-form-header">
          <h2>{expense ? 'Edit Expense' : 'Add New Expense'}</h2>
          <button className="close-button" onClick={onCancel} type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="What did you spend on?"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : expense ? 'Update' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseForm
