import { ApiProperty } from '@nestjs/swagger';
import { ValidationErrorType } from '../enums/validation-error-type.enum';

export class ValidationError {
  @ApiProperty({
    enum: ValidationErrorType,
    example: ValidationErrorType.MISSING_CHECKPOINT,
  })
  type: ValidationErrorType;

  @ApiProperty()
  message: string;

  constructor(
    type: ValidationErrorType,
    message: string,
  ) {
    this.type = type;
    this.message = message;
  }
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
  @ApiProperty()
  expectedBalance: number;

  @ApiProperty()
  actualBalance: number;

  constructor(
    expectedBalance: number,
    actualBalance: number,
  ) {
    super(
      ValidationErrorType.BALANCE_MISMATCH,
      `Final balance does not match calculated balance.`,
    );
    this.expectedBalance = expectedBalance;
    this.actualBalance = actualBalance;
  }
}

export class DuplicateMovementsError extends ValidationError {
  @ApiProperty()
  duplicateTransactions: string[];

  constructor(duplicateTransactions: string[]) {
    super(
      ValidationErrorType.DUPLICATE_MOVEMENT,
      `Duplicate movements detected: ${duplicateTransactions.join(', ')}`,
    );
    this.duplicateTransactions = duplicateTransactions;
  }
}

export class InconsistentDateError extends ValidationError {
  @ApiProperty()
  movementId: string;

  @ApiProperty()
  movementDate: Date;

  constructor(
    movementId: string,
    movementDate: Date,
  ) {
    super(
      ValidationErrorType.INCONSISTENT_DATE,
      `Inconsistent date for movement ${movementId}: ${movementDate}`,
    );
    this.movementId = movementId;
    this.movementDate = movementDate;
  }
}


export class UnexpectedAmountError extends ValidationError {
  @ApiProperty()
  movementId: string;

  @ApiProperty()
  amount: number;

  constructor(
    movementId: string,
    amount: number,
  ) {
    super(
      ValidationErrorType.UNEXPECTED_AMOUNT,
      `Unexpected amount for movement ${movementId}: ${amount}`,
    );
    this.movementId = movementId;
    this.amount = amount;
  }
}


export class PotentialMovementDuplicateError extends ValidationError {
  @ApiProperty()
  movementIds: string[];

  constructor(movementIds: string[]) {
    super(
      ValidationErrorType.POTENTIAL_MOVEMENT_DUPLICATE,
      `Potential duplicate movements detected: ${movementIds.join(', ')}`,
    );
    this.movementIds = movementIds;
  }
}


