import { Module } from '@nestjs/common';
import { BankSyncValidationsService } from './bank-sync-validations.service';
import { BankSyncValidationsController } from './bank-sync-validations.controller';

@Module({
  controllers: [BankSyncValidationsController],
  providers: [BankSyncValidationsService],
})
export class BankSyncValidationsModule {}
