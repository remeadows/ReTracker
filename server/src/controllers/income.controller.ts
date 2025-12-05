import { Response } from 'express';
import type { Income, CreateIncomeDto, UpdateIncomeDto, ApiResponse } from '@shared/types/index.js';
import { pool } from '../config/database.js';
import { calculateTaxRate } from '../utils/taxCalculator.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAllIncome = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, amount, description, income_type as "incomeType", pay_frequency as "payFrequency", hours_per_week as "hoursPerWeek", tax_rate as "taxRate", date, created_at as "createdAt", updated_at as "updatedAt" FROM income WHERE user_id = $1 ORDER BY date DESC',
      [req.userId]
    );

    const response: ApiResponse<Income[]> = {
      success: true,
      data: result.rows,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching income:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch income',
    };
    res.status(500).json(response);
  }
};

export const getIncomeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, amount, description, income_type as "incomeType", pay_frequency as "payFrequency", hours_per_week as "hoursPerWeek", tax_rate as "taxRate", date, created_at as "createdAt", updated_at as "updatedAt" FROM income WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Income not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Income> = {
      success: true,
      data: result.rows[0],
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching income:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch income',
    };
    res.status(500).json(response);
  }
};

export const createIncome = async (req: AuthRequest, res: Response) => {
  try {
    const dto: CreateIncomeDto = req.body;

    if (!dto.amount || !dto.description || !dto.incomeType || !dto.date) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Missing required fields',
      };
      return res.status(400).json(response);
    }

    // Calculate yearly income based on type
    let yearlyIncome = dto.amount;
    if (dto.incomeType === 'hourly' && dto.hoursPerWeek) {
      yearlyIncome = dto.amount * dto.hoursPerWeek * 52;
    } else if (dto.incomeType === 'salary' && dto.payFrequency) {
      const periods = dto.payFrequency === 'biweekly' ? 26 : 24;
      yearlyIncome = dto.amount * periods;
    }

    // Calculate estimated tax rate
    const taxRate = calculateTaxRate(yearlyIncome);

    const result = await pool.query(
      'INSERT INTO income (amount, description, income_type, pay_frequency, hours_per_week, tax_rate, date, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, amount, description, income_type as "incomeType", pay_frequency as "payFrequency", hours_per_week as "hoursPerWeek", tax_rate as "taxRate", date, created_at as "createdAt", updated_at as "updatedAt"',
      [dto.amount, dto.description, dto.incomeType, dto.payFrequency || null, dto.hoursPerWeek || null, taxRate, dto.date, req.userId]
    );

    const response: ApiResponse<Income> = {
      success: true,
      data: result.rows[0],
    };
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating income:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to create income',
    };
    res.status(500).json(response);
  }
};

export const updateIncome = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const dto: UpdateIncomeDto = req.body;

    const checkResult = await pool.query('SELECT * FROM income WHERE id = $1 AND user_id = $2', [id, req.userId]);
    if (checkResult.rows.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Income not found',
      };
      return res.status(404).json(response);
    }

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
    if (dto.incomeType !== undefined) {
      updates.push(`income_type = $${paramCount++}`);
      values.push(dto.incomeType);
    }
    if (dto.payFrequency !== undefined) {
      updates.push(`pay_frequency = $${paramCount++}`);
      values.push(dto.payFrequency);
    }
    if (dto.hoursPerWeek !== undefined) {
      updates.push(`hours_per_week = $${paramCount++}`);
      values.push(dto.hoursPerWeek);
    }
    if (dto.date !== undefined) {
      updates.push(`date = $${paramCount++}`);
      values.push(dto.date);
    }

    // Recalculate tax if amount changed
    const currentIncome = checkResult.rows[0];
    const newAmount = dto.amount || currentIncome.amount;
    const newIncomeType = dto.incomeType || currentIncome.income_type;
    const newPayFrequency = dto.payFrequency || currentIncome.pay_frequency;
    const newHoursPerWeek = dto.hoursPerWeek || currentIncome.hours_per_week;

    let yearlyIncome = newAmount;
    if (newIncomeType === 'hourly' && newHoursPerWeek) {
      yearlyIncome = newAmount * newHoursPerWeek * 52;
    } else if (newIncomeType === 'salary' && newPayFrequency) {
      const periods = newPayFrequency === 'biweekly' ? 26 : 24;
      yearlyIncome = newAmount * periods;
    }

    const taxRate = calculateTaxRate(yearlyIncome);
    updates.push(`tax_rate = $${paramCount++}`);
    values.push(taxRate);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    values.push(req.userId);

    const result = await pool.query(
      `UPDATE income SET ${updates.join(', ')} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING id, amount, description, income_type as "incomeType", pay_frequency as "payFrequency", hours_per_week as "hoursPerWeek", tax_rate as "taxRate", date, created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );

    const response: ApiResponse<Income> = {
      success: true,
      data: result.rows[0],
    };
    res.json(response);
  } catch (error) {
    console.error('Error updating income:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to update income',
    };
    res.status(500).json(response);
  }
};

export const deleteIncome = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM income WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.userId]);

    if (result.rows.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Income not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Income deleted successfully' },
    };
    res.json(response);
  } catch (error) {
    console.error('Error deleting income:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to delete income',
    };
    res.status(500).json(response);
  }
};
