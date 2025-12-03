// Shared types between client and server

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'utilities'
  | 'healthcare'
  | 'shopping'
  | 'other';

export type RecurringFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'yearly';

export interface CreateExpenseDto {
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
}

export interface UpdateExpenseDto {
  amount?: number;
  description?: string;
  category?: ExpenseCategory;
  date?: string;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
}

export interface Income {
  id: string;
  amount: number;
  description: string;
  incomeType: IncomeType;
  payFrequency?: PayFrequency;
  hoursPerWeek?: number;
  taxRate: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type IncomeType = 'salary' | 'hourly';
export type PayFrequency = 'biweekly' | 'semimonthly';

export interface CreateIncomeDto {
  amount: number;
  description: string;
  incomeType: IncomeType;
  payFrequency?: PayFrequency;
  hoursPerWeek?: number;
  date: string;
}

export interface UpdateIncomeDto {
  amount?: number;
  description?: string;
  incomeType?: IncomeType;
  payFrequency?: PayFrequency;
  hoursPerWeek?: number;
  date?: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  monthlyTotal: number;
  averageDaily: number;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  yearlyIncome: number;
  yearlyExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netIncome: number;
  netMonthly: number;
  savingsRate: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
