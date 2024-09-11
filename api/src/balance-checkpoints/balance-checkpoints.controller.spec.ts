import { Test, TestingModule } from '@nestjs/testing';
import { BalanceCheckpointsController } from './balance-checkpoints.controller';
import { BalanceCheckpointsService } from './balance-checkpoints.service';
import { NotFoundException } from '@nestjs/common';

describe('BalanceCheckpointsController', () => {
  let controller: BalanceCheckpointsController;
  let service: BalanceCheckpointsService;

  const mockBalanceCheckpointsService = {
    create: jest.fn(),
    findByPeriodId: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceCheckpointsController],
      providers: [
        BalanceCheckpointsService,
        {
          provide: BalanceCheckpointsService,
          useValue: mockBalanceCheckpointsService,
        },
      ],
    }).compile();

    controller = module.get<BalanceCheckpointsController>(
      BalanceCheckpointsController,
    );
    service = module.get<BalanceCheckpointsService>(BalanceCheckpointsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new balance checkpoint', async () => {
      const createBalanceCheckpointDto = {
        date: new Date(),
        balance: 3000,
      };
      const periodId = 'uuid';
      const savedBalanceCheckpoint = {
        id: 'uuid',
        ...createBalanceCheckpointDto,
      };
      mockBalanceCheckpointsService.create.mockResolvedValue(
        savedBalanceCheckpoint,
      );
      const result = await controller.create(
        periodId,
        createBalanceCheckpointDto,
      );
      expect(result).toEqual(savedBalanceCheckpoint);
      expect(service.create).toHaveBeenCalledWith(
        periodId,
        createBalanceCheckpointDto,
      );
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllForPeriod', () => {
    it('should return an array of balance checkpoints', async () => {
      const periodId = 'uuid';
      const balanceCheckpoints = [
        {
          id: 'uuid',
          date: new Date(),
          balance: 3000,
        },
      ];
      mockBalanceCheckpointsService.findByPeriodId.mockResolvedValue(
        balanceCheckpoints,
      );
      const result = await controller.findAllForPeriod(periodId);
      expect(result).toEqual(balanceCheckpoints);
      expect(service.findByPeriodId).toHaveBeenCalledWith(periodId);
      expect(service.findByPeriodId).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    it('should return a balance checkpoint', async () => {
      const balanceCheckpointId = 'uuid';
      const balanceCheckpoint = {
        id: 'uuid',
        date: new Date(),
        balance: 3000,
      };
      mockBalanceCheckpointsService.findOneById.mockResolvedValue(
        balanceCheckpoint,
      );
      const result = await controller.findOne(balanceCheckpointId);
      expect(result).toEqual(balanceCheckpoint);
      expect(service.findOneById).toHaveBeenCalledWith(balanceCheckpointId);
      expect(service.findOneById).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a balance checkpoint', async () => {
      const balanceCheckpointId = 'uuid';
      const updateBalanceCheckpointDto = {
        date: new Date(),
        balance: 3000,
      };
      const updatedBalanceCheckpoint = {
        id: 'uuid',
        ...updateBalanceCheckpointDto,
      };
      mockBalanceCheckpointsService.update.mockResolvedValue(
        updatedBalanceCheckpoint,
      );
      const result = await controller.update(
        balanceCheckpointId,
        updateBalanceCheckpointDto,
      );
      expect(result).toEqual(updatedBalanceCheckpoint);
      expect(service.update).toHaveBeenCalledWith(
        balanceCheckpointId,
        updateBalanceCheckpointDto,
      );
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a balance checkpoint', async () => {
      const balanceCheckpointId = 'uuid';
      const balanceCheckpoint = {
        id: 'uuid',
        date: new Date(),
        balance: 3000,
      };
      mockBalanceCheckpointsService.remove.mockResolvedValue(balanceCheckpoint);
      const result = await controller.remove(balanceCheckpointId);
      expect(result).toEqual(balanceCheckpoint);
      expect(service.remove).toHaveBeenCalledWith(balanceCheckpointId);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if balance checkpoint is not found', async () => {
      const balanceCheckpointId = 'uuid';
      mockBalanceCheckpointsService.remove.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(controller.remove(balanceCheckpointId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(balanceCheckpointId);
    });
  });
});
