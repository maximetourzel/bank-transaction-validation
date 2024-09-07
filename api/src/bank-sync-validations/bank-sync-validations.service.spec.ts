import { Test, TestingModule } from '@nestjs/testing';
import { BankSyncValidationsService } from './bank-sync-validations.service';

describe('BankSyncValidationsService', () => {
  let service: BankSyncValidationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankSyncValidationsService],
    }).compile();

    service = module.get<BankSyncValidationsService>(BankSyncValidationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
