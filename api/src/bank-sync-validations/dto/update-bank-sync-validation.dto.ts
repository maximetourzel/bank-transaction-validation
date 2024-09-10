import { PartialType } from '@nestjs/mapped-types';
import { CreateBankSyncValidationDto } from './create-bank-sync-validation.dto';

export class UpdateBankSyncValidationDto extends PartialType(
  CreateBankSyncValidationDto,
) {}
