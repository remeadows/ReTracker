import { useState, useEffect } from 'react'
import type { Income, CreateIncomeDto, IncomeType, PayFrequency } from '@shared/types'
import '../styles/ExpenseForm.css'

interface IncomeFormProps {
  income?: Income
  onSubmit: (data: CreateIncomeDto) => Promise<void>
  onCancel: () => void
}

const incomeTypes: IncomeType[] = ['salary', 'hourly']
const payFrequencies: PayFrequency[] = ['biweekly', 'semimonthly']

function IncomeForm({ income, onSubmit, onCancel }: IncomeFormProps) {
  const [formData, setFormData] = useState<CreateIncomeDto>({
    amount: income?.amount || '' as any,
    description: income?.description || '',
    incomeType: income?.incomeType || 'salary',
    payFrequency: income?.payFrequency || 'biweekly',
    hoursPerWeek: income?.hoursPerWeek || undefined,
    date: income?.date || new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (income) {
      setFormData({
        amount: income.amount,
        description: income.description,
        incomeType: income.incomeType,
        payFrequency: income.payFrequency,
        hoursPerWeek: income.hoursPerWeek,
        date: income.date.split('T')[0],
      })
    }
  }, [income])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.amount || formData.amount <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }
    if (formData.incomeType === 'hourly' && (!formData.hoursPerWeek || formData.hoursPerWeek <= 0)) {
      setError('Hours per week is required for hourly income')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save income')
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
      [name]: name === 'amount' || name === 'hoursPerWeek' ? (value === '' ? '' as any : parseFloat(value)) : value,
    }))
  }

  // Calculate estimated yearly income and tax for display
  const calculateYearlyIncome = () => {
    if (formData.incomeType === 'hourly' && formData.hoursPerWeek) {
      return formData.amount * formData.hoursPerWeek * 52
    } else if (formData.incomeType === 'salary') {
      const periods = formData.payFrequency === 'biweekly' ? 26 : 24
      return formData.amount * periods
    }
    return 0
  }

  const yearlyIncome = calculateYearlyIncome()

  return (
    <div className="expense-form-overlay">
      <div className="expense-form-container">
        <div className="expense-form-header">
          <h2>{income ? 'Edit Income' : 'Add New Income'}</h2>
          <button className="close-button" onClick={onCancel} type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="incomeType">Income Type</label>
            <select
              id="incomeType"
              name="incomeType"
              value={formData.incomeType}
              onChange={handleChange}
              required
            >
              {incomeTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">
              {formData.incomeType === 'salary' ? 'Amount per Pay Period ($)' : 'Hourly Rate ($)'}
            </label>
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

          {formData.incomeType === 'salary' && (
            <div className="form-group">
              <label htmlFor="payFrequency">Pay Frequency</label>
              <select
                id="payFrequency"
                name="payFrequency"
                value={formData.payFrequency || 'biweekly'}
                onChange={handleChange}
                required
              >
                {payFrequencies.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)} ({freq === 'biweekly' ? '26' : '24'} periods/year)
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.incomeType === 'hourly' && (
            <div className="form-group">
              <label htmlFor="hoursPerWeek">Hours per Week</label>
              <input
                type="number"
                id="hoursPerWeek"
                name="hoursPerWeek"
                value={formData.hoursPerWeek || ''}
                onChange={handleChange}
                step="0.5"
                min="0"
                max="168"
                required
                placeholder="40"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="e.g., Main job salary, Freelance work"
              rows={3}
            />
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
            />
          </div>

          {yearlyIncome > 0 && (
            <div className="income-estimate">
              <p>
                <strong>Estimated Yearly Income:</strong> ${yearlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-muted">
                Tax rate will be automatically calculated when you save
              </p>
            </div>
          )}

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
              {loading ? 'Saving...' : income ? 'Update' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IncomeForm
