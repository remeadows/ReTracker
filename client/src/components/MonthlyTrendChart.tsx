import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { Expense } from '@shared/types'
import '../styles/Charts.css'

interface MonthlyTrendChartProps {
  expenses: Expense[]
}

function MonthlyTrendChart({ expenses }: MonthlyTrendChartProps) {
  // Group expenses by month
  const monthlyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const amount = parseFloat(expense.amount as any)

    const existing = acc.find((item) => item.month === monthYear)
    if (existing) {
      existing.amount += amount
      existing.count += 1
    } else {
      acc.push({
        month: monthYear,
        monthName,
        amount: amount,
        count: 1,
      })
    }
    return acc
  }, [] as { month: string; monthName: string; amount: number; count: number }[])

  // Sort by month
  monthlyData.sort((a, b) => a.month.localeCompare(b.month))

  // Only show last 6 months
  const recentMonths = monthlyData.slice(-6)

  if (recentMonths.length === 0) {
    return (
      <div className="chart-container">
        <h3>Monthly Spending Trend</h3>
        <div className="chart-empty">No data available</div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.monthName}</p>
          <p className="tooltip-value">${payload[0].value.toFixed(2)}</p>
          <p className="tooltip-count">{payload[0].payload.count} expenses</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-container">
      <h3>Monthly Spending Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={recentMonths}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthName" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="amount" fill="#4f46e5" name="Spending ($)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyTrendChart
