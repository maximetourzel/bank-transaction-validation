import { Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}
  async create(createPeriodDto: CreatePeriodDto): Promise<Period> {
    const period = this.periodRepository.create(createPeriodDto);
    return this.periodRepository.save(period);
  }

  findAll(): Promise<Period[]> {
    return this.periodRepository.find();
  }

  findOneById(id: string): Promise<Period> {
    return this.periodRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<Period> {
    const periodToRemove = await this.findOneById(id);
    return this.periodRepository.remove(periodToRemove);
  }
}
