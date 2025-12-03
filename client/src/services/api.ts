import axios from 'axios'
import type { Expense, CreateExpenseDto, UpdateExpenseDto, ExpenseStats, ApiResponse } from '@shared/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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
