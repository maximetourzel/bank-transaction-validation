import { Module } from '@nestjs/common';
import { BankSyncValidationsService } from './bank-sync-validations.service';
import { BankSyncValidationsController } from './bank-sync-validations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankSyncValidation } from './entities/bank-sync-validation.entity';
import { BankMovement } from 'src/bank-movements/entities/bank-movement.entity';
import { BalanceCheckpoint } from 'src/balance-checkpoints/entities/balance-checkpoint.entity';
import { Period } from 'src/periods/entities/period.entity';
import { PeriodsService } from 'src/periods/periods.service';
import { BankMovementsService } from 'src/bank-movements/bank-movements.service';
import { BalanceCheckpointsService } from 'src/balance-checkpoints/balance-checkpoints.service';

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
