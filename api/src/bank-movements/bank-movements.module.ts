import { Module } from '@nestjs/common';
import { BankMovementsService } from './bank-movements.service';
import { BankMovementsController } from './bank-movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankMovement } from './entities/bank-movement.entity';
import { Period } from '../periods/entities/period.entity';
import { PeriodsService } from '../periods/periods.service';
import { BankSyncValidation } from '../bank-sync-validations/entities/bank-sync-validation.entity';
import { BalanceCheckpoint } from '../balance-checkpoints/entities/balance-checkpoint.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BalanceCheckpoint,
      Period,
      BankSyncValidation,
      BankMovement,
    ]),
  ],
  controllers: [BankMovementsController],
  providers: [PeriodsService, BankMovementsService],
})
export class BankMovementsModule {}
