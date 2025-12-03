import { Router } from 'express';
import * as budgetController from '../controllers/budget.controller.js';

const router = Router();

router.get('/summary', budgetController.getBudgetSummary);

export default router;
