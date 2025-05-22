
/**
 * Validation utilities for compensation dialog
 */

/**
 * Validates the compensation amount based on the compensation type
 */
export const validateAmount = (value: string, type: 'credit' | 'adjustment' | ""): string | undefined => {
  if (!value.trim() || isNaN(Number(value))) {
    return "please-enter-valid-amount";
  }
  
  const amountValue = Number(value);
  
  if (type === 'credit' && amountValue <= 0) {
    return "credit-must-be-positive";
  }
  
  return undefined;
};
