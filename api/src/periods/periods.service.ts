import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}
  async create(createPeriodDto: CreatePeriodDto): Promise<Period> {
    const period = plainToInstance(Period, createPeriodDto, {
      excludeExtraneousValues: true,
    });
    try {
      return await this.periodRepository.save(period);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.driverError.code === '23505') {
          throw new ConflictException('Period already exists');
        }
      }
    }
  }

  findAll(): Promise<Period[]> {
    return this.periodRepository.find();
  }

  async findOneById(id: string): Promise<Period> {
    const period = await this.periodRepository.findOneBy({ id });
    if (!period) {
      throw new NotFoundException(`Period with id ${id} not found`);
    }
    return period;
  }

  async remove(id: string): Promise<Period> {
    const periodToRemove = await this.findOneById(id);
    return this.periodRepository.remove(periodToRemove);
  }
}
