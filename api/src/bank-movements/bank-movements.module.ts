import { Module } from '@nestjs/common';
import { BankMovementsService } from './bank-movements.service';
import { BankMovementsController } from './bank-movements.controller';

@Module({
  controllers: [BankMovementsController],
  providers: [BankMovementsService],
})
export class BankMovementsModule {}
