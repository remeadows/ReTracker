import { Response } from 'express';
import type { Expense, CreateExpenseDto, UpdateExpenseDto, ApiResponse, ExpenseStats } from '@shared/types/index.js';
import { pool } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAllExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, amount, description, category, date, is_recurring as "isRecurring", recurring_frequency as "recurringFrequency", created_at as "createdAt", updated_at as "updatedAt" FROM expenses WHERE user_id = $1 ORDER BY date DESC',
      [req.userId]
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

export const getExpenseById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, amount, description, category, date, is_recurring as "isRecurring", recurring_frequency as "recurringFrequency", created_at as "createdAt", updated_at as "updatedAt" FROM expenses WHERE id = $1 AND user_id = $2',
      [id, req.userId]
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

export const createExpense = async (req: AuthRequest, res: Response) => {
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
      'INSERT INTO expenses (amount, description, category, date, is_recurring, recurring_frequency, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, amount, description, category, date, is_recurring as "isRecurring", recurring_frequency as "recurringFrequency", created_at as "createdAt", updated_at as "updatedAt"',
      [dto.amount, dto.description, dto.category, dto.date, dto.isRecurring || false, dto.recurringFrequency || null, req.userId]
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

export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const dto: UpdateExpenseDto = req.body;

    // Check if expense exists and belongs to user
    const checkResult = await pool.query('SELECT id FROM expenses WHERE id = $1 AND user_id = $2', [id, req.userId]);
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
    if (dto.isRecurring !== undefined) {
      updates.push(`is_recurring = $${paramCount++}`);
      values.push(dto.isRecurring);
    }
    if (dto.recurringFrequency !== undefined) {
      updates.push(`recurring_frequency = $${paramCount++}`);
      values.push(dto.recurringFrequency);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    values.push(req.userId);

    const result = await pool.query(
      `UPDATE expenses SET ${updates.join(', ')} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING id, amount, description, category, date, is_recurring as "isRecurring", recurring_frequency as "recurringFrequency", created_at as "createdAt", updated_at as "updatedAt"`,
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

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.userId]);

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

export const getExpenseStats = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get total expenses for user
    const totalResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = $1',
      [req.userId]
    );
    const totalExpenses = parseFloat(totalResult.rows[0].total);

    // Get monthly total for user
    const monthlyResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3',
      [req.userId, currentMonth, currentYear]
    );
    const monthlyTotal = parseFloat(monthlyResult.rows[0].total);

    // Get category breakdown for user
    const categoryResult = await pool.query(
      'SELECT category, COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = $1 GROUP BY category',
      [req.userId]
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
