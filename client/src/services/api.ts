import axios from 'axios'
import type { Expense, CreateExpenseDto, UpdateExpenseDto, ExpenseStats, Income, CreateIncomeDto, UpdateIncomeDto, BudgetSummary, ApiResponse } from '@shared/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await api.get<ApiResponse<Expense[]>>('/expenses')
  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to fetch expenses')
  }
  return response.data.data || []
}

export const getExpenseById = async (id: string): Promise<Expense> => {
  const response = await api.get<ApiResponse<Expense>>(`/expenses/${id}`)
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch expense')
  }
  return response.data.data
}

export const createExpense = async (expense: CreateExpenseDto): Promise<Expense> => {
  const response = await api.post<ApiResponse<Expense>>('/expenses', expense)
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create expense')
  }
  return response.data.data
}

export const updateExpense = async (id: string, expense: UpdateExpenseDto): Promise<Expense> => {
  const response = await api.put<ApiResponse<Expense>>(`/expenses/${id}`, expense)
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to update expense')
  }
  return response.data.data
}

export const deleteExpense = async (id: string): Promise<void> => {
  const response = await api.delete<ApiResponse<{ message: string }>>(`/expenses/${id}`)
  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to delete expense')
  }
}

export const getStats = async (): Promise<ExpenseStats> => {
  const response = await api.get<ApiResponse<ExpenseStats>>('/expenses/stats')
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch stats')
  }
  return response.data.data
}

// Income API methods
export const getIncome = async (): Promise<Income[]> => {
  const response = await api.get<ApiResponse<Income[]>>('/income')
  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to fetch income')
  }
  return response.data.data || []
}

export const getIncomeById = async (id: string): Promise<Income> => {
  const response = await api.get<ApiResponse<Income>>(`/income/${id}`)
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch income')
  }
  return response.data.data
}

export const createIncome = async (income: CreateIncomeDto): Promise<Income> => {
  const response = await api.post<ApiResponse<Income>>('/income', income)
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create income')
  }
  return response.data.data
}

export const updateIncome = async (id: string, income: UpdateIncomeDto): Promise<Income> => {
  const response = await api.put<ApiResponse<Income>>(`/income/${id}`, income)
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to update income')
  }
  return response.data.data
}

export const deleteIncome = async (id: string): Promise<void> => {
  const response = await api.delete<ApiResponse<{ message: string }>>(`/income/${id}`)
  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to delete income')
  }
}

// Budget API methods
export const getBudgetSummary = async (): Promise<BudgetSummary> => {
  const response = await api.get<ApiResponse<BudgetSummary>>('/budget/summary')
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch budget summary')
  }
  return response.data.data
}
