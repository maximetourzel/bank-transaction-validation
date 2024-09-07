import { Test, TestingModule } from '@nestjs/testing';
import { BalanceCheckpointsService } from './balance-checkpoints.service';

describe('BalanceCheckpointsService', () => {
  let service: BalanceCheckpointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceCheckpointsService],
    }).compile();

    service = module.get<BalanceCheckpointsService>(BalanceCheckpointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
