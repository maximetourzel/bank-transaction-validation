import { Test, TestingModule } from '@nestjs/testing';
import { BankMovementsService } from './bank-movements.service';
import { BankMovement } from './entities/bank-movement.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PeriodsService } from '../periods/periods.service';
import { NotFoundException } from '@nestjs/common';

describe('BankMovementsService', () => {
  let movementService: BankMovementsService;

  const mockBankMovementsRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockPeriodsService = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankMovementsService,
        {
          provide: getRepositoryToken(BankMovement),
          useValue: mockBankMovementsRepository,
        },
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
        },
      ],
    }).compile();

    movementService = module.get<BankMovementsService>(BankMovementsService);
  });

  it('should be defined', () => {
    expect(movementService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new bank movement', async () => {
      const periodId = 'uuid';
      const createBankMovementDto = {
        date: new Date(),
        wording: 'Salary',
        amount: 3000,
      };
      const period = {
        id: 'uuid',
      };
      const savedBankMovement = {
        id: 'uuid',
        ...createBankMovementDto,
      };
      mockPeriodsService.findOneById.mockResolvedValueOnce(period);
      mockBankMovementsRepository.create.mockReturnValueOnce(savedBankMovement);
      mockBankMovementsRepository.save.mockResolvedValueOnce(savedBankMovement);
      const result = await movementService.create(
        periodId,
        createBankMovementDto,
      );
      expect(result).toEqual(savedBankMovement);
      expect(mockPeriodsService.findOneById).toHaveBeenCalledTimes(1);
      expect(mockPeriodsService.findOneById).toHaveBeenCalledWith(periodId);
      expect(mockBankMovementsRepository.create).toHaveBeenCalledTimes(1);
      expect(mockBankMovementsRepository.create).toHaveBeenCalledWith({
        ...createBankMovementDto,
        period,
      });
      expect(mockBankMovementsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockBankMovementsRepository.save).toHaveBeenCalledWith(
        savedBankMovement,
      );
    });
  });

  describe('findAllForPeriod', () => {
    it('should return an array of bank movements', async () => {
      const periodId = 'uuid';
      const bankMovements = [
        {
          id: 'uuid',
        },
      ];
      mockBankMovementsRepository.find.mockResolvedValueOnce(bankMovements);
      const result = await movementService.findAllForPeriod(periodId);
      expect(result).toEqual(bankMovements);
      expect(mockBankMovementsRepository.find).toHaveBeenCalledTimes(1);
      expect(mockBankMovementsRepository.find).toHaveBeenCalledWith({
        where: { period: { id: periodId } },
      });
    });
  });

  describe('findByPeriodId', () => {
    it('should return an array of bank movements', async () => {
      const periodId = 'uuid';
      const bankMovements = [
        {
          id: 'uuid',
        },
      ];
      mockBankMovementsRepository.find.mockResolvedValueOnce(bankMovements);
      const result = await movementService.findByPeriodId(periodId);
      expect(result).toEqual(bankMovements);
      expect(mockBankMovementsRepository.find).toHaveBeenCalledWith({
        where: { period: { id: periodId } },
      });
    });
  });

  describe('findOneById', () => {
    it('should return a bank movement', async () => {
      const id = 'uuid';
      const bankMovement = {
        id: 'uuid',
      };
      mockBankMovementsRepository.findOneBy.mockResolvedValueOnce(bankMovement);
      const result = await movementService.findOneById(id);
      expect(result).toEqual(bankMovement);
      expect(mockBankMovementsRepository.findOneBy).toHaveBeenCalledWith({
        id,
      });
    });

    it('should throw a NotFoundException if bank movement is not found', async () => {
      const id = 'uuid';
      mockBankMovementsRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(movementService.findOneById(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockBankMovementsRepository.findOneBy).toHaveBeenCalledWith({
        id,
      });
    });
  });

  describe('remove', () => {
    it('should remove a bank movement', async () => {
      const id = 'uuid';
      const bankMovement = {
        id: 'uuid',
      };
      mockBankMovementsRepository.findOneBy.mockResolvedValueOnce(bankMovement);
      mockBankMovementsRepository.remove.mockResolvedValueOnce(bankMovement);
      const result = await movementService.remove(id);
      expect(result).toEqual(bankMovement);
      expect(mockBankMovementsRepository.remove).toHaveBeenCalledWith(
        bankMovement,
      );
    });

    it('should throw a NotFoundException if bank movement is not found', async () => {
      const bankMovement = {
        id: 'uuid',
      };
      mockBankMovementsRepository.remove.mockResolvedValueOnce(null);
      await expect(movementService.remove(bankMovement.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockBankMovementsRepository.remove).toHaveBeenCalledWith(
        bankMovement,
      );
    });
  });
});
