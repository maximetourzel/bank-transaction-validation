import { ValidationError } from './validation-error';

export interface Validation {
  id: string;
  isValid: boolean;
  validationErrors: ValidationError[];
  isHistorical: boolean;
}
