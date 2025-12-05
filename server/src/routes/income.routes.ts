import { Router } from 'express';
import * as incomeController from '../controllers/income.controller.js';
import {
  validateCreateIncome,
  validateUpdateIncome,
  validateUUID,
} from '../middleware/validation.js';

const router = Router();

router.get('/', incomeController.getAllIncome);
router.get('/:id', validateUUID, incomeController.getIncomeById);
router.post('/', validateCreateIncome, incomeController.createIncome);
router.put('/:id', validateUpdateIncome, incomeController.updateIncome);
router.delete('/:id', validateUUID, incomeController.deleteIncome);

export default router;
