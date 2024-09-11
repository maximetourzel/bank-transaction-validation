import { Test, TestingModule } from '@nestjs/testing';
import { BankMovementsController } from './bank-movements.controller';
import { BankMovementsService } from './bank-movements.service';
import { NotFoundException } from '@nestjs/common';

describe('BankMovementsController', () => {
  let controller: BankMovementsController;
  let service: BankMovementsService;

  const mockBankMovementsService = {
    create: jest.fn(),
    findAllForPeriod: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankMovementsController],
      providers: [
        BankMovementsService,
        {
          provide: BankMovementsService,
          useValue: mockBankMovementsService,
        },
      ],
    }).compile();

    controller = module.get<BankMovementsController>(BankMovementsController);
    service = module.get<BankMovementsService>(BankMovementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new bank movement', async () => {
      const createBankMovementDto = {
        date: new Date(),
        wording: 'Salary',
        amount: 3000,
      };
      const periodId = 'uuid';
      const savedBankMovement = {
        id: 'uuid',
        ...createBankMovementDto,
      };
      mockBankMovementsService.create.mockResolvedValue(savedBankMovement);
      const result = await controller.create(periodId, createBankMovementDto);
      expect(result).toEqual(savedBankMovement);
      expect(service.create).toHaveBeenCalledWith(
        periodId,
        createBankMovementDto,
      );
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllForPeriod', () => {
    it('should return an array of bank movements', async () => {
      const periodId = 'uuid';
      const bankMovements = [
        {
          id: 'uuid',
          date: new Date(),
          wording: 'Salary',
          amount: 3000,
        },
      ];
      mockBankMovementsService.findAllForPeriod.mockResolvedValue(
        bankMovements,
      );
      const result = await controller.findAllForPeriod(periodId);
      expect(result).toEqual(bankMovements);
      expect(service.findAllForPeriod).toHaveBeenCalledWith(periodId);
      expect(service.findAllForPeriod).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a bank movement', async () => {
      const bankMovement = {
        id: 'uuid',
        date: new Date(),
        wording: 'Salary',
        amount: 3000,
      };
      mockBankMovementsService.remove.mockResolvedValue(bankMovement);
      await controller.remove(bankMovement.id);
      expect(service.remove).toHaveBeenCalledWith(bankMovement.id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if bank movement is not found', async () => {
      const id = 'uuid';
      mockBankMovementsService.remove.mockRejectedValueOnce(
        new NotFoundException(),
      );
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
