import { Test, TestingModule } from '@nestjs/testing';
import { PeriodsService } from './periods.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { QueryFailedError } from 'typeorm';
import { CreatePeriodDto } from './dto/create-period.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PeriodMonth } from './enums/period-month.enum';

describe('PeriodsService', () => {
  let service: PeriodsService;

  const mockPeriodRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeriodsService,
        {
          provide: getRepositoryToken(Period),
          useValue: mockPeriodRepository,
        },
      ],
    }).compile();

    service = module.get<PeriodsService>(PeriodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new period', async () => {
      const createPeriodDto: CreatePeriodDto = {
        year: 2024,
        month: PeriodMonth.SEPTEMBER,
      };
      const savedPeriod = {
        ...createPeriodDto,
        id: 'uuid',
        startDate: new Date(),
        endDate: new Date(),
      } as Period;

      mockPeriodRepository.save.mockResolvedValueOnce(savedPeriod);

      const result = await service.create(createPeriodDto);

      expect(result).toEqual(savedPeriod);
      expect(mockPeriodRepository.save).toHaveBeenCalledTimes(1);
      expect(mockPeriodRepository.save).toHaveBeenCalledWith(
        expect.any(Period),
      );
    });

    it('should throw a ConflictException if period already exists', async () => {
      const createPeriodDto: CreatePeriodDto = {
        year: 2024,
        month: PeriodMonth.SEPTEMBER,
      };

      mockPeriodRepository.save.mockRejectedValueOnce(new QueryFailedError<any>('', [], { code: '23505' }));

      await expect(service.create(createPeriodDto)).rejects.toThrow(
        ConflictException,
      );
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

      mockPeriodRepository.find.mockResolvedValue(periods);

      const result = await service.findAll();

      expect(result).toEqual(periods);
      expect(mockPeriodRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    it('should return a period by id', async () => {
      const period = {
        id: 'uuid',
        year: 2024,
        month: PeriodMonth.SEPTEMBER,
        startDate: new Date(),
        endDate: new Date(),
      };

      mockPeriodRepository.findOneBy.mockResolvedValue(period);

      const result = await service.findOneById('uuid');

      expect(result).toEqual(period);
      expect(mockPeriodRepository.findOneBy).toHaveBeenCalledWith({
        id: 'uuid',
      });
      expect(mockPeriodRepository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if period not found', async () => {
      mockPeriodRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneById('uuid')).rejects.toThrow(
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

      mockPeriodRepository.findOneBy.mockResolvedValue(period);
      mockPeriodRepository.remove.mockResolvedValue(period);

      const result = await service.remove('uuid');

      expect(result).toEqual(period);
      expect(mockPeriodRepository.remove).toHaveBeenCalledWith(period);
    });

    it('should throw a NotFoundException if period not found', async () => {
      mockPeriodRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
