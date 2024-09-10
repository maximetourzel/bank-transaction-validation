import { Test, TestingModule } from '@nestjs/testing';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { Period } from './entities/period.entity';
import { NotFoundException } from '@nestjs/common';
import { PeriodMonth } from './enums/period-month.enum';

describe('PeriodsController', () => {
  let controller: PeriodsController;
  let service: PeriodsService;

  const mockPeriodsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodsController],
      providers: [
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
        },
      ],
    }).compile();

    controller = module.get<PeriodsController>(PeriodsController);
    service = module.get<PeriodsService>(PeriodsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new period', async () => {
      const createPeriodDto: CreatePeriodDto = {
        year: 2024,
        month: PeriodMonth.SEPTEMBER,
      };
      const savedPeriod: Period = {
        ...createPeriodDto,
        id: 'uuid',
        startDate: new Date(),
        endDate: new Date(),
      } as Period;

      mockPeriodsService.create.mockResolvedValue(savedPeriod);

      const result = await controller.create(createPeriodDto);

      expect(result).toEqual(savedPeriod);
      expect(service.create).toHaveBeenCalledWith(createPeriodDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of periods', async () => {
      const periods = [
        {
          id: 'uuid',
          year: 2024,
          month: PeriodMonth.SEPTEMBER,
          startDate: new Date(),
          endDate: new Date(),
        },
      ];

      mockPeriodsService.findAll.mockResolvedValue(periods);

      const result = await controller.findAll();

      expect(result).toEqual(periods);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a period by id', async () => {
      const period = {
        id: 'uuid',
        year: 2024,
        month: PeriodMonth.SEPTEMBER,
        startDate: new Date(),
        endDate: new Date(),
      };

      mockPeriodsService.findOneById.mockResolvedValue(period);

      const result = await controller.findOne('uuid');

      expect(result).toEqual(period);
      expect(service.findOneById).toHaveBeenCalledWith('uuid');
    });

    it('should throw a NotFoundException if period not found', async () => {
      mockPeriodsService.findOneById.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a period', async () => {
      const period = {
        id: 'uuid',
        year: 2024,
        month: PeriodMonth.SEPTEMBER,
        startDate: new Date(),
        endDate: new Date(),
      };

      mockPeriodsService.remove.mockResolvedValue(period);

      await controller.remove('uuid');
      expect(service.remove).toHaveBeenCalledWith('uuid');
    });

    it('should throw a NotFoundException if period not found', async () => {
      mockPeriodsService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
