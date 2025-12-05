import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

/**
 * Validation rules for creating an expense
 */
export const validateCreateExpense = [
  body('amount')
    .isFloat({ min: 0.01, max: 1000000 })
    .withMessage('Amount must be between 0.01 and 1,000,000'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('category')
    .isIn(['food', 'transport', 'entertainment', 'utilities', 'healthcare', 'shopping', 'other'])
    .withMessage('Invalid category'),
  body('date')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean'),
  body('recurringFrequency')
    .optional()
    .isIn(['daily', 'weekly', 'biweekly', 'monthly', 'yearly'])
    .withMessage('Invalid recurring frequency'),
  handleValidationErrors,
];

/**
 * Validation rules for updating an expense
 */
export const validateUpdateExpense = [
  param('id')
    .isUUID()
    .withMessage('Invalid expense ID'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01, max: 1000000 })
    .withMessage('Amount must be between 0.01 and 1,000,000'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('category')
    .optional()
    .isIn(['food', 'transport', 'entertainment', 'utilities', 'healthcare', 'shopping', 'other'])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean'),
  body('recurringFrequency')
    .optional()
    .isIn(['daily', 'weekly', 'biweekly', 'monthly', 'yearly'])
    .withMessage('Invalid recurring frequency'),
  handleValidationErrors,
];

/**
 * Validation rules for creating income
 */
export const validateCreateIncome = [
  body('amount')
    .isFloat({ min: 0.01, max: 10000000 })
    .withMessage('Amount must be between 0.01 and 10,000,000'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('incomeType')
    .isIn(['salary', 'hourly'])
    .withMessage('Income type must be salary or hourly'),
  body('payFrequency')
    .optional()
    .isIn(['biweekly', 'semimonthly'])
    .withMessage('Pay frequency must be biweekly or semimonthly'),
  body('hoursPerWeek')
    .optional()
    .isFloat({ min: 0.1, max: 168 })
    .withMessage('Hours per week must be between 0.1 and 168'),
  body('date')
    .isISO8601()
    .withMessage('Invalid date format'),
  // Custom validation: salary requires payFrequency, hourly requires hoursPerWeek
  body('payFrequency')
    .if(body('incomeType').equals('salary'))
    .notEmpty()
    .withMessage('Pay frequency is required for salary income'),
  body('hoursPerWeek')
    .if(body('incomeType').equals('hourly'))
    .notEmpty()
    .withMessage('Hours per week is required for hourly income'),
  handleValidationErrors,
];

/**
 * Validation rules for updating income
 */
export const validateUpdateIncome = [
  param('id')
    .isUUID()
    .withMessage('Invalid income ID'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01, max: 10000000 })
    .withMessage('Amount must be between 0.01 and 10,000,000'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('incomeType')
    .optional()
    .isIn(['salary', 'hourly'])
    .withMessage('Income type must be salary or hourly'),
  body('payFrequency')
    .optional()
    .isIn(['biweekly', 'semimonthly'])
    .withMessage('Pay frequency must be biweekly or semimonthly'),
  body('hoursPerWeek')
    .optional()
    .isFloat({ min: 0.1, max: 168 })
    .withMessage('Hours per week must be between 0.1 and 168'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  handleValidationErrors,
];

/**
 * Validation for UUID parameters
 */
export const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  handleValidationErrors,
];
