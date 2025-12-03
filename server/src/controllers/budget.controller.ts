import { Request, Response } from 'express';
import type { ApiResponse, BudgetSummary } from '@shared/types/index.js';
import { pool } from '../config/database.js';
import { projectYearlyExpenses, calculateNetIncome } from '../utils/taxCalculator.js';

export const getBudgetSummary = async (req: Request, res: Response) => {
  try {
    // Get all income
    const incomeResult = await pool.query(
      'SELECT amount, income_type, pay_frequency, hours_per_week, tax_rate FROM income'
    );

    // Get all expenses with recurring info
    const expensesResult = await pool.query(
      'SELECT amount, is_recurring, recurring_frequency FROM expenses'
    );

    // Calculate total income
    let yearlyIncome = 0;
    let yearlyTax = 0;

    for (const income of incomeResult.rows) {
      const amount = parseFloat(income.amount);
      let yearly = amount;

      if (income.income_type === 'hourly' && income.hours_per_week) {
        yearly = amount * parseFloat(income.hours_per_week) * 52;
      } else if (income.income_type === 'salary' && income.pay_frequency) {
        const periods = income.pay_frequency === 'biweekly' ? 26 : 24;
        yearly = amount * periods;
      }

      yearlyIncome += yearly;
      yearlyTax += yearly * (parseFloat(income.tax_rate) / 100);
    }

    const netYearlyIncome = yearlyIncome - yearlyTax;

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
