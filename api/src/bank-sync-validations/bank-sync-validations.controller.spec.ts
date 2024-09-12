import { Test, TestingModule } from '@nestjs/testing';
import { BankSyncValidationsController } from './bank-sync-validations.controller';
import { BankSyncValidationsService } from './bank-sync-validations.service';
import { BankSyncValidation } from './entities/bank-sync-validation.entity';
import { NotFoundException } from '@nestjs/common';
import { PeriodsService } from '../periods/periods.service';
import { BankMovementsService } from '../bank-movements/bank-movements.service';
import { BalanceCheckpointsService } from '../balance-checkpoints/balance-checkpoints.service';

const mockValidation: BankSyncValidation = {
  id: 'validation-id',
  period: null,
  isValid: true,
  validationErrors: [],
  movements: [],
  checkpoints: [],
  previousValidation: null,
  isHistorical: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BankSyncValidationsController', () => {
  let controller: BankSyncValidationsController;
  let service: BankSyncValidationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankSyncValidationsController],
      providers: [
        {
          provide: BankSyncValidationsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockValidation),
            findOneByPeriodId: jest.fn().mockResolvedValue(mockValidation),
            findOne: jest.fn().mockResolvedValue(mockValidation),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: PeriodsService,
          useValue: {
            findOneById: jest.fn().mockResolvedValue({ id: 'period-id' }),
          },
        },
        {
          provide: BankMovementsService,
          useValue: {
            findByPeriodId: jest
              .fn()
              .mockResolvedValue([{ id: 'movement-id', amount: 100 }]),
          },
        },
        {
          provide: BalanceCheckpointsService,
          useValue: {
            findByPeriodId: jest
              .fn()
              .mockResolvedValue([{ id: 'checkpoint-id', balance: 100 }]),
          },
        },
      ],
    }).compile();

    controller = module.get<BankSyncValidationsController>(
      BankSyncValidationsController,
    );
    service = module.get<BankSyncValidationsService>(
      BankSyncValidationsService,
    );
  });

  describe('create', () => {
    it('should create a new validation and return it', async () => {
      const periodId = 'period-id';
      const result = await controller.create(periodId);

      expect(service.create).toHaveBeenCalledWith(periodId);
      expect(result).toEqual(mockValidation);
    });

    it('should throw NotFoundException if the period is not found', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new NotFoundException());

      await expect(controller.create('invalid-period-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByPeriod', () => {
    it('should return a validation for the given period', async () => {
      const periodId = 'period-id';
      const result = await controller.findOneByPeriod(periodId);

      expect(service.findOneByPeriodId).toHaveBeenCalledWith(periodId);
      expect(result).toEqual(mockValidation);
    });

    it('should throw NotFoundException if the validation is not found for the period', async () => {
      jest
        .spyOn(service, 'findOneByPeriodId')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.findOneByPeriod('invalid-period-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a validation with the given id', async () => {
      const validationId = 'validation-id';
      const result = await controller.findOne(validationId);

      expect(service.findOne).toHaveBeenCalledWith(validationId);
      expect(result).toEqual(mockValidation);
    });

    it('should throw NotFoundException if the validation is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-validation-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a validation with the given id', async () => {
      const validationId = 'validation-id';

      await controller.remove(validationId);

      expect(service.remove).toHaveBeenCalledWith(validationId);
    });

    it('should throw NotFoundException if the validation to remove is not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('invalid-validation-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
