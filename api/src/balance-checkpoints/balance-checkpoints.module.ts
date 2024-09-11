import { Module } from '@nestjs/common';
import { BalanceCheckpointsService } from './balance-checkpoints.service';
import { BalanceCheckpointsController } from './balance-checkpoints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceCheckpoint } from './entities/balance-checkpoint.entity';
import { PeriodsService } from '../periods/periods.service';
import { Period } from '../periods/entities/period.entity';
import { BankSyncValidation } from '../bank-sync-validations/entities/bank-sync-validation.entity';
import { BankMovement } from '../bank-movements/entities/bank-movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BalanceCheckpoint,
      Period,
      BankSyncValidation,
      BankMovement,
    ]),
  ],
  controllers: [BalanceCheckpointsController],
  providers: [BalanceCheckpointsService, PeriodsService],
})
export class BalanceCheckpointsModule {}
