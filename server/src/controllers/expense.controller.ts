import { Request, Response } from 'express';
import type { Expense, CreateExpenseDto, UpdateExpenseDto, ApiResponse, ExpenseStats } from '@shared/types/index.js';
import { pool } from '../config/database.js';

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, amount, description, category, date, created_at as "createdAt", updated_at as "updatedAt" FROM expenses ORDER BY date DESC'
    );

    const response: ApiResponse<Expense[]> = {
      success: true,
      data: result.rows,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch expenses',
    };
    res.status(500).json(response);
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, amount, description, category, date, created_at as "createdAt", updated_at as "updatedAt" FROM expenses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Expense not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Expense> = {
      success: true,
      data: result.rows[0],
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching expense:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch expense',
    };
    res.status(500).json(response);
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const dto: CreateExpenseDto = req.body;

    if (!dto.amount || !dto.description || !dto.category || !dto.date) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Missing required fields',
      };
      return res.status(400).json(response);
    }

    const result = await pool.query(
      'INSERT INTO expenses (amount, description, category, date) VALUES ($1, $2, $3, $4) RETURNING id, amount, description, category, date, created_at as "createdAt", updated_at as "updatedAt"',
      [dto.amount, dto.description, dto.category, dto.date]
    );

    const response: ApiResponse<Expense> = {
      success: true,
      data: result.rows[0],
    };
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating expense:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to create expense',
    };
    res.status(500).json(response);
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dto: UpdateExpenseDto = req.body;

    // Check if expense exists
    const checkResult = await pool.query('SELECT id FROM expenses WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Expense not found',
      };
      return res.status(404).json(response);
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (dto.amount !== undefined) {
      updates.push(`amount = $${paramCount++}`);
      values.push(dto.amount);
    }
    if (dto.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(dto.description);
    }
    if (dto.category !== undefined) {
      updates.push(`category = $${paramCount++}`);
      values.push(dto.category);
    }
    if (dto.date !== undefined) {
      updates.push(`date = $${paramCount++}`);
      values.push(dto.date);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE expenses SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, amount, description, category, date, created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );

    const response: ApiResponse<Expense> = {
      success: true,
      data: result.rows[0],
    };
    res.json(response);
  } catch (error) {
    console.error('Error updating expense:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to update expense',
    };
    res.status(500).json(response);
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Expense not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Expense deleted successfully' },
    };
    res.json(response);
  } catch (error) {
    console.error('Error deleting expense:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to delete expense',
    };
    res.status(500).json(response);
  }
};

export const getExpenseStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get total expenses
    const totalResult = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM expenses');
    const totalExpenses = parseFloat(totalResult.rows[0].total);

    // Get monthly total
    const monthlyResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2',
      [currentMonth, currentYear]
    );
    const monthlyTotal = parseFloat(monthlyResult.rows[0].total);

    // Get category breakdown
    const categoryResult = await pool.query(
      'SELECT category, COALESCE(SUM(amount), 0) as total FROM expenses GROUP BY category'
    );
    const categoryBreakdown = categoryResult.rows.reduce((acc, row) => {
      acc[row.category] = parseFloat(row.total);
      return acc;
    }, {} as Record<string, number>);

    // Calculate average daily for current month
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const averageDaily = monthlyTotal / daysInMonth;

    const stats: ExpenseStats = {
      totalExpenses,
      categoryBreakdown: categoryBreakdown as any,
      monthlyTotal,
      averageDaily: parseFloat(averageDaily.toFixed(2)),
    };

    const response: ApiResponse<ExpenseStats> = {
      success: true,
      data: stats,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch stats',
    };
    res.status(500).json(response);
  }
};
