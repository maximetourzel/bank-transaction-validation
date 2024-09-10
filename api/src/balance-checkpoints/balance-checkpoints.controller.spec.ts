import { Test, TestingModule } from '@nestjs/testing';
import { BalanceCheckpointsController } from './balance-checkpoints.controller';
import { BalanceCheckpointsService } from './balance-checkpoints.service';

describe('BalanceCheckpointsController', () => {
  let controller: BalanceCheckpointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceCheckpointsController],
      providers: [BalanceCheckpointsService],
    }).compile();

    controller = module.get<BalanceCheckpointsController>(
      BalanceCheckpointsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
