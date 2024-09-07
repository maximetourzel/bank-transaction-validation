import { PartialType } from '@nestjs/mapped-types';
import { CreateBankMovementDto } from './create-bank-movement.dto';

export class UpdateBankMovementDto extends PartialType(CreateBankMovementDto) {}
