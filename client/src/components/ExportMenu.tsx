import { useState } from 'react'
import type { Expense } from '@shared/types'
import { exportToCSV, printExpenses } from '../utils/export'
import '../styles/ExportMenu.css'

interface ExportMenuProps {
  expenses: Expense[]
}

function ExportMenu({ expenses }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleExportCSV = () => {
    const filename = `retracker-expenses-${new Date().toISOString().split('T')[0]}.csv`
    exportToCSV(expenses, filename)
    setIsOpen(false)
  }

  const handlePrint = () => {
    printExpenses(expenses)
    setIsOpen(false)
  }

  if (expenses.length === 0) {
    return null
  }

  return (
    <div className="export-menu">
      <button className="export-btn" onClick={() => setIsOpen(!isOpen)}>
        📥 Export
      </button>
      {isOpen && (
        <>
          <div className="export-overlay" onClick={() => setIsOpen(false)} />
          <div className="export-dropdown">
            <button onClick={handleExportCSV} className="export-option">
              <span className="export-icon">📄</span>
              Export as CSV
            </button>
            <button onClick={handlePrint} className="export-option">
              <span className="export-icon">🖨️</span>
              Print / Save as PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ExportMenu
