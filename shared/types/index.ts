// Shared types between client and server

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
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

export interface CreateExpenseDto {
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
}

export interface UpdateExpenseDto {
  amount?: number;
  description?: string;
  category?: ExpenseCategory;
  date?: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  monthlyTotal: number;
  averageDaily: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
