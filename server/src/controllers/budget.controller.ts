import { Request, Response } from 'express';
import type { ApiResponse, BudgetSummary } from '@shared/types/index.js';
import { pool } from '../config/database.js';
import { projectYearlyExpenses, calculateNetIncome } from '../utils/taxCalculator.js';

export const getBudgetSummary = async (req: Request, res: Response) => {
  try {
    // Optimized: Calculate income in database using SQL aggregation
    const incomeResult = await pool.query(`
      SELECT
        COALESCE(SUM(
          CASE
            WHEN income_type = 'hourly' THEN amount * hours_per_week * 52
            WHEN income_type = 'salary' AND pay_frequency = 'biweekly' THEN amount * 26
            WHEN income_type = 'salary' AND pay_frequency = 'semimonthly' THEN amount * 24
            ELSE amount
          END
        ), 0) as yearly_income,
        COALESCE(SUM(
          CASE
            WHEN income_type = 'hourly' THEN amount * hours_per_week * 52 * (tax_rate / 100)
            WHEN income_type = 'salary' AND pay_frequency = 'biweekly' THEN amount * 26 * (tax_rate / 100)
            WHEN income_type = 'salary' AND pay_frequency = 'semimonthly' THEN amount * 24 * (tax_rate / 100)
            ELSE amount * (tax_rate / 100)
          END
        ), 0) as yearly_tax
      FROM income
    `);

    const yearlyIncome = parseFloat(incomeResult.rows[0].yearly_income);
    const yearlyTax = parseFloat(incomeResult.rows[0].yearly_tax);
    const netYearlyIncome = yearlyIncome - yearlyTax;

    // Get all expenses with recurring info
    const expensesResult = await pool.query(
      'SELECT amount, is_recurring, recurring_frequency FROM expenses'
    );

    // Calculate expenses (project recurring to yearly)
    const expenses = expensesResult.rows.map(row => ({
      amount: parseFloat(row.amount),
      isRecurring: row.is_recurring,
      recurringFrequency: row.recurring_frequency,
    }));

    const yearlyExpenses = projectYearlyExpenses(expenses);

    // Calculate summary
    const summary: BudgetSummary = {
      totalIncome: netYearlyIncome,
      totalExpenses: yearlyExpenses,
      yearlyIncome: netYearlyIncome,
      yearlyExpenses: yearlyExpenses,
      monthlyIncome: netYearlyIncome / 12,
      monthlyExpenses: yearlyExpenses / 12,
      netIncome: netYearlyIncome - yearlyExpenses,
      netMonthly: (netYearlyIncome - yearlyExpenses) / 12,
      savingsRate: yearlyIncome > 0 ? ((netYearlyIncome - yearlyExpenses) / netYearlyIncome) * 100 : 0,
    };

    const response: ApiResponse<BudgetSummary> = {
      success: true,
      data: summary,
    };
    res.json(response);
  } catch (error) {
    console.error('Error calculating budget:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to calculate budget',
    };
    res.status(500).json(response);
  }
};
