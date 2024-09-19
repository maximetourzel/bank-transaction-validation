import { ValidationErrorType } from '../enums/validation-error-type.enum';

export interface ValidationError {
  type: ValidationErrorType;
  message: string;
}

export interface MissingCheckpointError extends ValidationError {
  type: ValidationErrorType.MISSING_CHECKPOINT;
  message: 'No checkpoint found';
}

export interface MissingMovementsError extends ValidationError {
  type: ValidationErrorType.MISSING_MOVEMENTS;
  message: 'No movements found';
}

export interface BalanceMismatchError extends ValidationError {
  type: ValidationErrorType.BALANCE_MISMATCH;
  message: 'Final balance does not match calculated balance.';
  expectedBalance: number;
  actualBalance: number;
}

export interface DuplicateMovementsError extends ValidationError {
  type: ValidationErrorType.DUPLICATE_MOVEMENT;
  message: 'Duplicate movements found.';
  duplicateTransactions: string[];
}

export interface InconsistentDateError extends ValidationError {
  type: ValidationErrorType.INCONSISTENT_DATE;
  message: 'Movements have inconsistent dates.';
}

export interface UnexpectedAmountError extends ValidationError {
  type: ValidationErrorType.UNEXPECTED_AMOUNT;
  message: 'Movements have unexpected amounts.';
  movementId: string;
  amount: number;
}

export interface PotentialMovementDuplicateError extends ValidationError {
  type: ValidationErrorType.POTENTIAL_MOVEMENT_DUPLICATE;
  message: 'Potential duplicate movements found.';
  movementIds: string[];
}

// Type guard pour BalanceMismatchError
export function isBalanceMismatchError(
  error: ValidationError,
): error is BalanceMismatchError {
  return error.type === ValidationErrorType.BALANCE_MISMATCH;
}

// Type guard pour MissingCheckpointError
export function isMissingCheckpointError(
  error: ValidationError,
): error is MissingCheckpointError {
  return error.type === ValidationErrorType.MISSING_CHECKPOINT;
}

// Type guard pour MissingMovementsError
export function isMissingMovementsError(
  error: ValidationError,
): error is MissingMovementsError {
  return error.type === ValidationErrorType.MISSING_MOVEMENTS;
}

// Type guard pour DuplicateMovementsError
export function isDuplicateMovementsError(
  error: ValidationError,
): error is DuplicateMovementsError {
  return error.type === ValidationErrorType.DUPLICATE_MOVEMENT;
}

// Type guard pour InconsistentDateError
export function isInconsistentDateError(
  error: ValidationError,
): error is InconsistentDateError {
  return error.type === ValidationErrorType.INCONSISTENT_DATE;
}

// Type guard pour UnexpectedAmountError
export function isUnexpectedAmountError(
  error: ValidationError,
): error is UnexpectedAmountError {
  return error.type === ValidationErrorType.UNEXPECTED_AMOUNT;
}

// Type guard pour PotentialMovementDuplicateError
export function isPotentialMovementDuplicateError(
  error: ValidationError,
): error is PotentialMovementDuplicateError {
  return error.type === ValidationErrorType.POTENTIAL_MOVEMENT_DUPLICATE;
}
