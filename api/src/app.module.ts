import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankMovementsModule } from './bank-movements/bank-movements.module';
import { BalanceCheckpointsModule } from './balance-checkpoints/balance-checkpoints.module';
import { BankSyncValidationsModule } from './bank-sync-validations/bank-sync-validations.module';

@Module({
  imports: [
    BankMovementsModule,
    BalanceCheckpointsModule,
    BankSyncValidationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
