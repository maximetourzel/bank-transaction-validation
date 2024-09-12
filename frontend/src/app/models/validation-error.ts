import { ValidationErrorType } from '../enums/validation-error-type.enum';

export interface ValidationError {
  type: ValidationErrorType;
  message: string;
}
