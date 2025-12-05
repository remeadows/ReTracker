import { Router } from 'express';
import * as budgetController from '../controllers/budget.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All budget routes require authentication
router.use(authenticateToken);

router.get('/summary', budgetController.getBudgetSummary);

export default router;
