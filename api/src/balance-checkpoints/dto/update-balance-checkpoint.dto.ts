import { PartialType } from '@nestjs/mapped-types';
import { CreateBalanceCheckpointDto } from './create-balance-checkpoint.dto';

export class UpdateBalanceCheckpointDto extends PartialType(
  CreateBalanceCheckpointDto,
) {}
