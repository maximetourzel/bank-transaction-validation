import { Test, TestingModule } from '@nestjs/testing';
import { BalanceCheckpointsService } from './balance-checkpoints.service';
import { PeriodsService } from '../periods/periods.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BalanceCheckpoint } from './entities/balance-checkpoint.entity';
import { NotFoundException } from '@nestjs/common';

describe('BalanceCheckpointsService', () => {
  let checkpointService: BalanceCheckpointsService;
  let periodsService: PeriodsService;

  const mockBalanceCheckpointsRepository = {
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
        BalanceCheckpointsService,
        {
          provide: getRepositoryToken(BalanceCheckpoint),
          useValue: mockBalanceCheckpointsRepository,
        },
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
        },
      ],
    }).compile();

    checkpointService = module.get<BalanceCheckpointsService>(
      BalanceCheckpointsService,
    );
    periodsService = module.get<PeriodsService>(PeriodsService);
  });

  it('should be defined', () => {
    expect(checkpointService).toBeDefined();
    expect(periodsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new balance checkpoint', async () => {
      const periodId = 'uuid';
      const createBalanceCheckpointDto = {
        date: new Date(),
        balance: 3000,
      };
      const period = {
        id: 'uuid',
      };
      const savedBalanceCheckpoint = {
        id: 'uuid',
        ...createBalanceCheckpointDto,
      };
      mockPeriodsService.findOneById.mockResolvedValueOnce(period);
      mockBalanceCheckpointsRepository.create.mockReturnValueOnce(
        savedBalanceCheckpoint,
      );
      mockBalanceCheckpointsRepository.save.mockResolvedValueOnce(
        savedBalanceCheckpoint,
      );
      const result = await checkpointService.create(
        periodId,
        createBalanceCheckpointDto,
      );
      expect(result).toEqual(savedBalanceCheckpoint);
      expect(mockPeriodsService.findOneById).toHaveBeenCalledTimes(1);
      expect(mockPeriodsService.findOneById).toHaveBeenCalledWith(periodId);
      expect(mockBalanceCheckpointsRepository.create).toHaveBeenCalledTimes(1);
      expect(mockBalanceCheckpointsRepository.create).toHaveBeenCalledWith({
        ...createBalanceCheckpointDto,
        period,
      });
      expect(mockBalanceCheckpointsRepository.save).toHaveBeenCalledTimes(1);
      expect(mockBalanceCheckpointsRepository.save).toHaveBeenCalledWith(
        savedBalanceCheckpoint,
      );
    });
  });

  describe('findByPeriodId', () => {
    it('should return an array of balance checkpoints', async () => {
      const periodId = 'uuid';
      const balanceCheckpoints = [
        {
          id: 'uuid',
        },
      ];
      mockBalanceCheckpointsRepository.find.mockResolvedValueOnce(
        balanceCheckpoints,
      );
      const result = await checkpointService.findByPeriodId(periodId);
      expect(result).toEqual(balanceCheckpoints);
      expect(mockBalanceCheckpointsRepository.find).toHaveBeenCalledTimes(1);
      expect(mockBalanceCheckpointsRepository.find).toHaveBeenCalledWith({
        where: { period: { id: periodId } },
      });
    });
  });

  describe('findOneById', () => {
    it('should return a balance checkpoint', async () => {
      const id = 'uuid';
      const balanceCheckpoint = {
        id: 'uuid',
      };
      mockBalanceCheckpointsRepository.findOneBy.mockResolvedValueOnce(
        balanceCheckpoint,
      );
      const result = await checkpointService.findOneById(id);
      expect(result).toEqual(balanceCheckpoint);
      expect(mockBalanceCheckpointsRepository.findOneBy).toHaveBeenCalledWith({
        id,
      });
    });

    it('should throw a NotFoundException if balance checkpoint is not found', async () => {
      const id = 'uuid';
      mockBalanceCheckpointsRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(checkpointService.findOneById(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockBalanceCheckpointsRepository.findOneBy).toHaveBeenCalledWith({
        id,
      });
    });
  });

  describe('remove', () => {
    it('should remove a balance checkpoint', async () => {
      const balanceCheckpoint = {
        id: 'uuid',
      };
      mockBalanceCheckpointsRepository.findOneBy.mockResolvedValueOnce(
        balanceCheckpoint,
      );
      mockBalanceCheckpointsRepository.remove.mockResolvedValueOnce(
        balanceCheckpoint,
      );
      const result = await checkpointService.remove(balanceCheckpoint.id);

      expect(result).toEqual(balanceCheckpoint);
      expect(mockBalanceCheckpointsRepository.remove).toHaveBeenCalledWith(
        balanceCheckpoint,
      );
    });

    it('should throw a NotFoundException if balance checkpoint is not found', async () => {
      const checkpoint = {
        id: 'uuid',
      };

      mockBalanceCheckpointsRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(checkpointService.remove(checkpoint.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
