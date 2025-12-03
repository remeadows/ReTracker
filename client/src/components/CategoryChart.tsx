import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { Expense } from '@shared/types'
import '../styles/Charts.css'

interface CategoryChartProps {
  expenses: Expense[]
}

const COLORS = {
  food: '#f59e0b',
  transport: '#3b82f6',
  entertainment: '#ec4899',
  utilities: '#8b5cf6',
  healthcare: '#ef4444',
  shopping: '#10b981',
  other: '#6b7280',
}

function CategoryChart({ expenses }: CategoryChartProps) {
  // Calculate spending by category
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.category === expense.category)
    if (existing) {
      existing.amount += expense.amount
    } else {
      acc.push({
        category: expense.category,
        amount: expense.amount,
      })
    }
    return acc
  }, [] as { category: string; amount: number }[])

  // Sort by amount descending
  categoryData.sort((a, b) => b.amount - a.amount)

  if (categoryData.length === 0) {
    return (
      <div className="chart-container">
        <h3>Spending by Category</h3>
        <div className="chart-empty">No data available</div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">${payload[0].value.toFixed(2)}</p>
          <p className="tooltip-percent">
            {((payload[0].value / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-container">
      <h3>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ category, percent }) =>
              `${category.charAt(0).toUpperCase() + category.slice(1)} ${(percent * 100).toFixed(0)}%`
            }
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.category as keyof typeof COLORS] || COLORS.other}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryChart
