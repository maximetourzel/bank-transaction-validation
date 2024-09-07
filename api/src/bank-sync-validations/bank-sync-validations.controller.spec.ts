import { Test, TestingModule } from '@nestjs/testing';
import { BankSyncValidationsController } from './bank-sync-validations.controller';
import { BankSyncValidationsService } from './bank-sync-validations.service';

describe('BankSyncValidationsController', () => {
  let controller: BankSyncValidationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankSyncValidationsController],
      providers: [BankSyncValidationsService],
    }).compile();

    controller = module.get<BankSyncValidationsController>(BankSyncValidationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
