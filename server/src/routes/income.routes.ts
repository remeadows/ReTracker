import { Router } from 'express';
import * as incomeController from '../controllers/income.controller.js';

const router = Router();

router.get('/', incomeController.getAllIncome);
router.get('/:id', incomeController.getIncomeById);
router.post('/', incomeController.createIncome);
router.put('/:id', incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);

export default router;
