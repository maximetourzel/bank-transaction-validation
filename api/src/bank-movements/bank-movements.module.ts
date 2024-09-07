import { Module } from '@nestjs/common';
import { BankMovementsService } from './bank-movements.service';
import { BankMovementsController } from './bank-movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankMovement } from './entities/bank-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankMovement])],
  controllers: [BankMovementsController],
  providers: [BankMovementsService],
})
export class BankMovementsModule {}
