import { useState } from 'react'
import type { ExpenseCategory } from '@shared/types'
import '../styles/ExpenseFilters.css'

export interface FilterOptions {
  search: string
  category: ExpenseCategory | 'all'
  dateFrom: string
  dateTo: string
}

interface ExpenseFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
}

const categories: (ExpenseCategory | 'all')[] = [
  'all',
  'food',
  'transport',
  'entertainment',
  'utilities',
  'healthcare',
  'shopping',
  'other',
]

function ExpenseFilters({ filters, onFilterChange }: ExpenseFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleChange = (field: keyof FilterOptions, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    })
  }

  const handleReset = () => {
    onFilterChange({
      search: '',
      category: 'all',
      dateFrom: '',
      dateTo: '',
    })
    setShowAdvanced(false)
  }

  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.dateFrom || filters.dateTo

  return (
    <div className="expense-filters">
      <div className="filters-main">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="category-filter"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`advanced-toggle ${showAdvanced ? 'active' : ''}`}
        >
          📅 Date Range
        </button>

        {hasActiveFilters && (
          <button type="button" onClick={handleReset} className="reset-filters">
            Clear Filters
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="filters-advanced">
          <div className="date-range">
            <div className="date-input-group">
              <label htmlFor="dateFrom">From</label>
              <input
                type="date"
                id="dateFrom"
                value={filters.dateFrom}
                onChange={(e) => handleChange('dateFrom', e.target.value)}
                max={filters.dateTo || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="date-input-group">
              <label htmlFor="dateTo">To</label>
              <input
                type="date"
                id="dateTo"
                value={filters.dateTo}
                onChange={(e) => handleChange('dateTo', e.target.value)}
                min={filters.dateFrom}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseFilters
