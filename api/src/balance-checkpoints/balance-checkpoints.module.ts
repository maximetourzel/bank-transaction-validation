import { Module } from '@nestjs/common';
import { BalanceCheckpointsService } from './balance-checkpoints.service';
import { BalanceCheckpointsController } from './balance-checkpoints.controller';

@Module({
  controllers: [BalanceCheckpointsController],
  providers: [BalanceCheckpointsService],
})
export class BalanceCheckpointsModule {}
