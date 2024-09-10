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

  /**
   * Creates a new period.
   *
   * @param createPeriodDto The data for the new period.
   * @returns The newly created period.
   * @throws {ConflictException} If a period with the same year and month already exists.
   */
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

  /**
   * Finds all periods.
   *
   * @returns A promise of an array of periods.
   */
  findAll(): Promise<Period[]> {
    return this.periodRepository.find();
  }

  /**
   * Finds a period by id.
   *
   * @param id The id of the period to find.
   * @returns The period with the given id.
   * @throws {NotFoundException} If no period with the given id exists.
   */
  async findOneById(id: string): Promise<Period> {
    const period = await this.periodRepository.findOneBy({ id });
    if (!period) {
      throw new NotFoundException(`Period with id ${id} not found`);
    }
    return period;
  }

  /**
   * Removes a period.
   *
   * @param id The id of the period to remove.
   * @returns The removed period.
   * @throws {NotFoundException} If no period with the given id exists.
   */
  async remove(id: string): Promise<Period> {
    const periodToRemove = await this.findOneById(id);
    return this.periodRepository.remove(periodToRemove);
  }
}
