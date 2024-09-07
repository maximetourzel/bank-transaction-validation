import { Test, TestingModule } from '@nestjs/testing';
import { BankMovementsService } from './bank-movements.service';

describe('BankMovementsService', () => {
  let service: BankMovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankMovementsService],
    }).compile();

    service = module.get<BankMovementsService>(BankMovementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
