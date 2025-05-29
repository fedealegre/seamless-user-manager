
/**
 * Validation utilities for compensation dialog
 */

/**
 * Validates the compensation amount - now allows both positive and negative values
 */
export const validateAmount = (value: string): string | undefined => {
  if (!value.trim() || isNaN(Number(value))) {
    return "please-enter-valid-amount";
  }
  
  const amountValue = Number(value);
  
  // Allow both positive and negative values, but not zero
  if (amountValue === 0) {
    return "amount-cannot-be-zero";
  }
  
  return undefined;
};

/**
 * Validates the origin wallet selection
 */
export const validateOriginWallet = (value: string): string | undefined => {
  if (!value) {
    return "please-select-company-wallet";
  }
  
  return undefined;
};
