import { ValidationErrorType } from '../enums/validation-error-type.enum';

export class ValidationError {
  constructor(
    public type: ValidationErrorType,
    public message: string,
  ) {}
}

export class MissingCheckpointError extends ValidationError {
  constructor() {
    super(ValidationErrorType.MISSING_CHECKPOINT, 'No checkpoint found');
  }
}

export class MissingMovementsError extends ValidationError {
  constructor() {
    super(ValidationErrorType.MISSING_MOVEMENTS, 'No movements found');
  }
}

export class BalanceMismatchError extends ValidationError {
  constructor(
    public expectedBalance: number,
    public actualBalance: number,
  ) {
    super(
      ValidationErrorType.BALANCE_MISMATCH,
      `Final balance does not match calculated balance. Expected: ${expectedBalance}, Actual: ${actualBalance}`,
    );
  }
}

export class DuplicateMovementsError extends ValidationError {
  constructor(public duplicateTransactions: string[]) {
    super(
      ValidationErrorType.DUPLICATE_MOVEMENT,
      `Duplicate movements detected: ${duplicateTransactions.join(', ')}`,
    );
  }
}

export class InconsistentDateError extends ValidationError {
  constructor(
    public movementId: string,
    public movementDate: Date,
  ) {
    super(
      ValidationErrorType.INCONSISTENT_DATE,
      `Inconsistent date for movement ${movementId}: ${movementDate}`,
    );
  }
}

export class InitialBalanceMismatchError extends ValidationError {
  constructor(
    public expectedBalance: number,
    public actualBalance: number,
  ) {
    super(
      ValidationErrorType.INITIAL_BALANCE_MISMATCH,
      `Initial balance does not match calculated balance. Expected: ${expectedBalance}, Actual: ${actualBalance}`,
    );
  }
}

export class UnexpectedAmountError extends ValidationError {
  constructor(
    public movementId: string,
    public amount: number,
  ) {
    super(
      ValidationErrorType.UNEXPECTED_AMOUNT,
      `Unexpected amount for movement ${movementId}: ${amount}`,
    );
  }
}

export class MissingTransactionError extends ValidationError {
  constructor(
    public expectedTransaction: {
      date: Date;
      amount: number;
      wording: string;
    },
  ) {
    super(
      ValidationErrorType.MISSING_TRANSACTION,
      `Missing transaction: ${expectedTransaction.date} - ${expectedTransaction.wording} - ${expectedTransaction.amount}`,
    );
  }
}

export class PotentialMovementDuplicateError extends ValidationError {
  constructor(public movementIds: string[]) {
    super(
      ValidationErrorType.POTENTIAL_MOVEMENT_DUPLICATE,
      `Potential duplicate movements detected: ${movementIds.join(', ')}`,
    );
  }
}

export class MissingIntermediateCheckpointError extends ValidationError {
  constructor(
    public missingPeriodStart: Date,
    public missingPeriodEnd: Date,
  ) {
    super(
      ValidationErrorType.MISSING_INTERMEDIATE_CHECKPOINT,
      `Missing intermediate checkpoint: ${missingPeriodStart} - ${missingPeriodEnd}`,
    );
  }
}

export class InconsistentBalanceError extends ValidationError {
  constructor(
    public startCheckpointId: string,
    public endCheckpointId: string,
    public expectedBalance: number,
    public actualBalance: number,
  ) {
    super(
      ValidationErrorType.INCONSISTENT_BALANCE,
      `Inconsistent balance from checkpoint ${startCheckpointId} to checkpoint ${endCheckpointId}. Expected: ${expectedBalance}, Actual: ${actualBalance}`,
    );
  }
}
