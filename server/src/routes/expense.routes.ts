import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import {
  validateCreateExpense,
  validateUpdateExpense,
  validateUUID,
} from '../middleware/validation.js';

const router = Router();

router.get('/', expenseController.getAllExpenses);
router.get('/stats', expenseController.getExpenseStats);
router.get('/:id', validateUUID, expenseController.getExpenseById);
router.post('/', validateCreateExpense, expenseController.createExpense);
router.put('/:id', validateUpdateExpense, expenseController.updateExpense);
router.delete('/:id', validateUUID, expenseController.deleteExpense);

export default router;
