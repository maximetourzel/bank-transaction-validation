import { Test, TestingModule } from '@nestjs/testing';
import { BankMovementsController } from './bank-movements.controller';
import { BankMovementsService } from './bank-movements.service';

describe('BankMovementsController', () => {
  let controller: BankMovementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankMovementsController],
      providers: [BankMovementsService],
    }).compile();

    controller = module.get<BankMovementsController>(BankMovementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
