import { Test, TestingModule } from '@nestjs/testing';
import { BankSyncValidationsService } from './bank-sync-validations.service';
import { PeriodsService } from '../periods/periods.service';
import { BankMovementsService } from '../bank-movements/bank-movements.service';
import { BalanceCheckpointsService } from '../balance-checkpoints/balance-checkpoints.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BankSyncValidation } from './entities/bank-sync-validation.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BankMovement } from '../bank-movements/entities/bank-movement.entity';
import { BalanceCheckpoint } from '../balance-checkpoints/entities/balance-checkpoint.entity';
import {
  BalanceMismatchError,
  MissingCheckpointError,
  MissingMovementsError,
  PotentialMovementDuplicateError,
} from './models/validation-error';

describe('BankSyncValidationsService', () => {
  let validationsService: BankSyncValidationsService;
  let periodsService: PeriodsService;
  let bankMovementsService: BankMovementsService;
  let balanceCheckpointsService: BalanceCheckpointsService;
  let validationRepository: Repository<BankSyncValidation>;

  const mockBankSyncValidationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockPeriodsService = {
    findOneById: jest.fn(),
  };

  const mockBankMovementsService = {
    findByPeriodId: jest.fn(),
  };

  const mockBalanceCheckpointsService = {
    findByPeriodId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankSyncValidationsService,
        {
          provide: getRepositoryToken(BankSyncValidation),
          useValue: mockBankSyncValidationRepository,
        },
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
        },
        {
          provide: BankMovementsService,
          useValue: mockBankMovementsService,
        },
        {
          provide: BalanceCheckpointsService,
          useValue: mockBalanceCheckpointsService,
        },
      ],
    }).compile();

    validationsService = module.get<BankSyncValidationsService>(
      BankSyncValidationsService,
    );
    periodsService = module.get<PeriodsService>(PeriodsService);
    bankMovementsService =
      module.get<BankMovementsService>(BankMovementsService);
    balanceCheckpointsService = module.get<BalanceCheckpointsService>(
      BalanceCheckpointsService,
    );
    validationRepository = module.get<Repository<BankSyncValidation>>(
      getRepositoryToken(BankSyncValidation),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(validationsService).toBeDefined();
    expect(periodsService).toBeDefined();
    expect(bankMovementsService).toBeDefined();
    expect(balanceCheckpointsService).toBeDefined();
    expect(validationRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of validations', async () => {
      const expectedValidations = [
        {
          id: 'uuid',
          period: {
            id: 'uuid',
          },
        },
      ];
      mockBankSyncValidationRepository.find.mockResolvedValueOnce(
        expectedValidations,
      );
      const result = await validationsService.findAll();
      expect(result).toEqual(expectedValidations);
      expect(mockBankSyncValidationRepository.find).toHaveBeenCalledWith({
        relations: {
          period: true,
          movements: true,
          checkpoints: true,
        },
      });
    });
  });

  describe('findOneByPeriodId', () => {
    it('should return a validation by period id', async () => {
      const expectedValidation = {
        id: 'uuid',
        period: {
          id: 'uuid',
        },
      };
      mockBankSyncValidationRepository.findOne.mockResolvedValueOnce(
        expectedValidation,
      );
      const result = await validationsService.findOneByPeriodId('uuid');

      expect(result).toEqual(expectedValidation);
      expect(mockBankSyncValidationRepository.findOne).toHaveBeenCalledWith({
        where: { period: { id: 'uuid' } },
        order: { createdAt: 'DESC' },

      });
    });
  });

  describe('findOne', () => {
    it('should return a validation by id', async () => {
      const validation = {
        id: 'uuid',
        period: {
          id: 'uuid',
        },
      };
      mockBankSyncValidationRepository.findOneBy.mockResolvedValueOnce(
        validation,
      );
      const result = await validationsService.findOne('uuid');
      expect(result).toEqual(validation);
      expect(mockBankSyncValidationRepository.findOneBy).toHaveBeenCalledWith({
        id: 'uuid',
      });
    });

    it('should throw an error if validation not found', async () => {
      mockBankSyncValidationRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(validationsService.findOne('uuid')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockBankSyncValidationRepository.findOneBy).toHaveBeenCalledWith({
        id: 'uuid',
      });
    });
  });

  describe('create', () => {
    it('should create a new validation', async () => {
      const periodId = 'uuid-period';
      const period = { id: periodId };
      const movements = [{ id: 'uuid-movement', amount: 100 }];
      const checkpoints = [{ id: 'uuid-checkpoint', balance: 100 }];
      const previousValidation = new BankSyncValidation();

      const validationWithoutId = {
        period,
        movements,
        checkpoints,
        isValid: true,
        validationErrors: [],
        previousValidation,
      };
      const validation = {
        id: 'uuid',
        ...validationWithoutId,
      };
      mockBankSyncValidationRepository.findOne.mockResolvedValueOnce(
        previousValidation,
      );
      mockPeriodsService.findOneById.mockResolvedValueOnce(period);
      mockBankMovementsService.findByPeriodId.mockResolvedValueOnce(movements);
      mockBalanceCheckpointsService.findByPeriodId.mockResolvedValueOnce(
        checkpoints,
      );
      mockBankSyncValidationRepository.create.mockReturnValueOnce(validation);
      jest
        .spyOn(mockBankSyncValidationRepository, 'save')
        .mockResolvedValue(validation);
      const result = await validationsService.create(periodId);
      expect(result).toEqual(validation);
      expect(mockPeriodsService.findOneById).toHaveBeenCalledWith(periodId);
      expect(mockBankMovementsService.findByPeriodId).toHaveBeenCalledWith(
        periodId,
      );
      expect(mockBalanceCheckpointsService.findByPeriodId).toHaveBeenCalledWith(
        periodId,
      );
      expect(mockBankSyncValidationRepository.create).toHaveBeenCalledWith(
        validationWithoutId,
      );
      expect(mockBankSyncValidationRepository.save).toHaveBeenCalledWith(
        expect.any(BankSyncValidation),
      );
    });

    it('should throw a NotFoundException if period is not found', async () => {
      const periodId = 'uuid';
      mockPeriodsService.findOneById.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(validationsService.create(periodId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a validation', async () => {
      const validation = {
        id: 'uuid',
        period: {
          id: 'uuid',
        },
      };
      jest
        .spyOn(mockBankSyncValidationRepository, 'findOneBy')
        .mockResolvedValueOnce(validation);
      jest
        .spyOn(mockBankSyncValidationRepository, 'remove')
        .mockResolvedValueOnce(validation);
      await validationsService.remove('uuid');
      expect(mockBankSyncValidationRepository.remove).toHaveBeenCalledTimes(1);
      expect(mockBankSyncValidationRepository.remove).toHaveBeenCalledWith(
        validation,
      );
    });
  });

  describe('validateMovementsAgainstCheckpoints', () => {
    it('should validate movements against checkpoints', () => {
      const movements = [
        { id: 'uuid-movement', amount: 100 },
      ] as BankMovement[];
      const checkpoints = [
        { id: 'uuid-checkpoint', balance: 100 },
      ] as BalanceCheckpoint[];
      const { isValid, errors } =
        validationsService.validateMovementsAgainstCheckpoints(
          movements,
          checkpoints,
        );
      expect(isValid).toBe(true);
      expect(errors).toEqual([]);
    });

    it('should not validate because of balance mismatch', () => {
      const movements = [
        { id: 'uuid-movement', amount: 100 },
      ] as BankMovement[];
      const checkpoints = [
        { id: 'uuid-checkpoint', balance: 200 },
      ] as BalanceCheckpoint[];
      const { isValid, errors } =
        validationsService.validateMovementsAgainstCheckpoints(
          movements,
          checkpoints,
        );
      expect(isValid).toBe(false);
      expect(errors).toEqual([expect.any(BalanceMismatchError)]);
    });

    it('should not validate because of missing checkpoint', () => {
      const movements = [
        { id: 'uuid-movement', amount: 100 },
      ] as BankMovement[];
      const checkpoints = [] as BalanceCheckpoint[];
      const { isValid, errors } =
        validationsService.validateMovementsAgainstCheckpoints(
          movements,
          checkpoints,
        );
      expect(isValid).toBe(false);
      expect(errors).toEqual([expect.any(MissingCheckpointError)]);
    });

    it('should not validate because of missing movements', () => {
      const movements = [] as BankMovement[];
      const checkpoints = [
        { id: 'uuid-checkpoint', balance: 100 },
      ] as BalanceCheckpoint[];
      const { isValid, errors } =
        validationsService.validateMovementsAgainstCheckpoints(
          movements,
          checkpoints,
        );
      expect(isValid).toBe(false);
      expect(errors).toEqual([expect.any(MissingMovementsError)]);
    });

    it('should not validate because of potential duplicate movements', () => {
      const movements = [
        { id: 'uuid-movement', amount: 100 },
        { id: 'uuid-movement', amount: 100 },
      ] as BankMovement[];
      const checkpoints = [
        { id: 'uuid-checkpoint', balance: 200 },
      ] as BalanceCheckpoint[];
      const { isValid, errors } =
        validationsService.validateMovementsAgainstCheckpoints(
          movements,
          checkpoints,
        );
      expect(isValid).toBe(false);
      expect(errors).toEqual([expect.any(PotentialMovementDuplicateError)]);
    });
  });
});
