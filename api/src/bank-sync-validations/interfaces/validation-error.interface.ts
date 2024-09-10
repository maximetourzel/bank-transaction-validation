import { ValidationErrorType } from '../enums/validation-error-type.enum';

export interface ValidationError {
  type: ValidationErrorType;
  message: string;
}

export interface MissingCheckpointError extends ValidationError {
  type: ValidationErrorType.MISSING_CHECKPOINT;
}

export interface MissingMovementsError extends ValidationError {
  type: ValidationErrorType.MISSING_MOVEMENTS;
}

export interface BalanceMismatchError extends ValidationError {
  type: ValidationErrorType.BALANCE_MISMATCH;
  expectedBalance: number;
  actualBalance: number;
}

export interface DuplicateMovementsError extends ValidationError {
  type: ValidationErrorType.DUPLICATE_MOVEMENT;
  duplicateTransactions: string[];
}

export interface InconsistentDateError extends ValidationError {
  type: ValidationErrorType.INCONSISTENT_DATE;
  movementId: string;
  movementDate: Date;
}

export interface InitialBalanceMismatchError extends ValidationError {
  type: ValidationErrorType.INITIAL_BALANCE_MISMATCH;
  expectedBalance: number;
  actualBalance: number;
}

export interface UnexpectedAmountError extends ValidationError {
  type: ValidationErrorType.UNEXPECTED_AMOUNT;
  movementId: string;
  amount: number;
}

export interface MissingTransactionError extends ValidationError {
  type: ValidationErrorType.MISSING_TRANSACTION;
  expectedTransaction: {
    date: Date;
    amount: number;
    wording: string;
  };
}

export interface PotentialMovementDuplicateError extends ValidationError {
  type: ValidationErrorType.POTENTIAL_MOVEMENT_DUPLICATE;
  movementIds: string[];
}

export interface MissingIntermediateCheckpointError extends ValidationError {
  type: ValidationErrorType.MISSING_INTERMEDIATE_CHECKPOINT;
  missingPeriodStart: Date;
  missingPeriodEnd: Date;
}

export interface InconsistentBalanceError extends ValidationError {
  type: ValidationErrorType.INCONSISTENT_BALANCE;
  startCheckpointId: string;
  endCheckpointId: string;
  expectedBalance: number;
  actualBalance: number;
}
