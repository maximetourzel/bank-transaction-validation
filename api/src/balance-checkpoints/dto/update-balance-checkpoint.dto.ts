import { PartialType } from '@nestjs/swagger';
import { CreateBalanceCheckpointDto } from './create-balance-checkpoint.dto';

export class UpdateBalanceCheckpointDto extends PartialType(
  CreateBalanceCheckpointDto,
) {}
