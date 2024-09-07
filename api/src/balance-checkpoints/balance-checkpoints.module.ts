import { Module } from '@nestjs/common';
import { BalanceCheckpointsService } from './balance-checkpoints.service';
import { BalanceCheckpointsController } from './balance-checkpoints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceCheckpoint } from './entities/balance-checkpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BalanceCheckpoint])],
  controllers: [BalanceCheckpointsController],
  providers: [BalanceCheckpointsService],
})
export class BalanceCheckpointsModule {}
