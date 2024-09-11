import { Module } from '@nestjs/common';
import { BankSyncValidationsService } from './bank-sync-validations.service';
import { BankSyncValidationsController } from './bank-sync-validations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankSyncValidation } from './entities/bank-sync-validation.entity';
import { BankMovement } from '../bank-movements/entities/bank-movement.entity';
import { BalanceCheckpoint } from '../balance-checkpoints/entities/balance-checkpoint.entity';
import { Period } from '../periods/entities/period.entity';
import { PeriodsService } from '../periods/periods.service';
import { BankMovementsService } from '../bank-movements/bank-movements.service';
import { BalanceCheckpointsService } from '../balance-checkpoints/balance-checkpoints.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankSyncValidation,
      BankMovement,
      BalanceCheckpoint,
      Period,
    ]),
  ],
  controllers: [BankSyncValidationsController],
  providers: [
    BankSyncValidationsService,
    PeriodsService,
    BankMovementsService,
    BalanceCheckpointsService,
  ],
})
export class BankSyncValidationsModule {}
