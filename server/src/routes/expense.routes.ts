import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateCreateExpense,
  validateUpdateExpense,
  validateUUID,
} from '../middleware/validation.js';

const router = Router();

// All expense routes require authentication
router.use(authenticateToken);

router.get('/', expenseController.getAllExpenses);
router.get('/stats', expenseController.getExpenseStats);
router.get('/:id', validateUUID, expenseController.getExpenseById);
router.post('/', validateCreateExpense, expenseController.createExpense);
router.put('/:id', validateUpdateExpense, expenseController.updateExpense);
router.delete('/:id', validateUUID, expenseController.deleteExpense);

export default router;
