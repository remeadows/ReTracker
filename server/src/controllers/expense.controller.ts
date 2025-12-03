import { Request, Response } from 'express';
import type { Expense, CreateExpenseDto, UpdateExpenseDto, ApiResponse, ExpenseStats } from '@shared/types/index.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage (replace with database later)
let expenses: Expense[] = [];

export const getAllExpenses = (req: Request, res: Response) => {
  const response: ApiResponse<Expense[]> = {
    success: true,
    data: expenses,
  };
  res.json(response);
};

export const getExpenseById = (req: Request, res: Response) => {
  const { id } = req.params;
  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Expense not found',
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<Expense> = {
    success: true,
    data: expense,
  };
  res.json(response);
};

export const createExpense = (req: Request, res: Response) => {
  const dto: CreateExpenseDto = req.body;

  if (!dto.amount || !dto.description || !dto.category || !dto.date) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Missing required fields',
    };
    return res.status(400).json(response);
  }

  const now = new Date().toISOString();
  const newExpense: Expense = {
    id: uuidv4(),
    ...dto,
    createdAt: now,
    updatedAt: now,
  };

  expenses.push(newExpense);

  const response: ApiResponse<Expense> = {
    success: true,
    data: newExpense,
  };
  res.status(201).json(response);
};

export const updateExpense = (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateExpenseDto = req.body;

  const index = expenses.findIndex(e => e.id === id);

  if (index === -1) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Expense not found',
    };
    return res.status(404).json(response);
  }

  const updatedExpense: Expense = {
    ...expenses[index],
    ...dto,
    updatedAt: new Date().toISOString(),
  };

  expenses[index] = updatedExpense;

  const response: ApiResponse<Expense> = {
    success: true,
    data: updatedExpense,
  };
  res.json(response);
};

export const deleteExpense = (req: Request, res: Response) => {
  const { id } = req.params;

  const index = expenses.findIndex(e => e.id === id);

  if (index === -1) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Expense not found',
    };
    return res.status(404).json(response);
  }

  expenses.splice(index, 1);

  const response: ApiResponse<{ message: string }> = {
    success: true,
    data: { message: 'Expense deleted successfully' },
  };
  res.json(response);
};

export const getExpenseStats = (req: Request, res: Response) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryBreakdown = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
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
};
