// 2024 Federal Tax Brackets (Single Filer)
const TAX_BRACKETS = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

/**
 * Calculate effective tax rate based on yearly income
 * Uses progressive tax brackets (2024 federal rates for single filer)
 */
export function calculateTaxRate(yearlyIncome: number): number {
  let totalTax = 0;
  let remainingIncome = yearlyIncome;

  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const bracket = TAX_BRACKETS[i];
    const bracketSize = bracket.max - bracket.min;

    if (remainingIncome <= 0) break;

    const taxableInBracket = Math.min(remainingIncome, bracketSize);
    totalTax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  const effectiveRate = yearlyIncome > 0 ? totalTax / yearlyIncome : 0;
  return parseFloat((effectiveRate * 100).toFixed(2));
}

/**
 * Calculate net income after taxes
 */
export function calculateNetIncome(grossIncome: number, taxRate: number): number {
  return grossIncome * (1 - taxRate / 100);
}

/**
 * Calculate yearly income from hourly wage
 */
export function calculateYearlyFromHourly(hourlyRate: number, hoursPerWeek: number): number {
  return hourlyRate * hoursPerWeek * 52;
}

/**
 * Calculate yearly income from salary based on pay frequency
 */
export function calculateYearlyFromSalary(
  payAmount: number,
  payFrequency: 'biweekly' | 'semimonthly'
): number {
  const periods = payFrequency === 'biweekly' ? 26 : 24;
  return payAmount * periods;
}

/**
 * Project yearly expenses based on recurring expenses
 */
export function projectYearlyExpenses(expenses: Array<{
  amount: number;
  isRecurring: boolean;
  recurringFrequency?: string;
}>): number {
  let yearlyTotal = 0;

  for (const expense of expenses) {
    if (!expense.isRecurring) {
      yearlyTotal += expense.amount;
      continue;
    }

    const multiplier = getYearlyMultiplier(expense.recurringFrequency);
    yearlyTotal += expense.amount * multiplier;
  }

  return yearlyTotal;
}

function getYearlyMultiplier(frequency?: string): number {
  switch (frequency) {
    case 'daily':
      return 365;
    case 'weekly':
      return 52;
    case 'biweekly':
      return 26;
    case 'monthly':
      return 12;
    case 'yearly':
      return 1;
    default:
      return 1;
  }
}
