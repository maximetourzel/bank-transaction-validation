import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBalanceCheckpointDto } from './dto/create-balance-checkpoint.dto';
import { UpdateBalanceCheckpointDto } from './dto/update-balance-checkpoint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceCheckpoint } from './entities/balance-checkpoint.entity';
import { Repository } from 'typeorm';
import { PeriodsService } from 'src/periods/periods.service';

@Injectable()
export class BalanceCheckpointsService {
  constructor(
    @InjectRepository(BalanceCheckpoint)
    private readonly balanceCheckpointsRepository: Repository<BalanceCheckpoint>,
    private readonly periodsService: PeriodsService,
  ) {}
  async create(
    periodId: string,
    createBalanceCheckpointDto: CreateBalanceCheckpointDto,
  ): Promise<BalanceCheckpoint> {
    const period = await this.periodsService.findOneById(periodId);
    //TODO: verify if createBalanceCheckpointDto.date is in period

    const newBalanceCheckpoint = this.balanceCheckpointsRepository.create({
      ...createBalanceCheckpointDto,
      period,
    });
    return this.balanceCheckpointsRepository.save(newBalanceCheckpoint);
  }

  findByPeriodId(periodId: string): Promise<BalanceCheckpoint[]> {
    return this.balanceCheckpointsRepository.find({
      where: { period: { id: periodId } },
    });
  }

  findOneById(id: string): Promise<BalanceCheckpoint> {
    const balanceCheckpoint = this.balanceCheckpointsRepository.findOneBy({
      id,
    });
    if (!balanceCheckpoint) {
      throw new NotFoundException(`BalanceCheckpoint with id ${id} not found`);
    }
    return balanceCheckpoint;
  }

  async update(
    id: string,
    updateBalanceCheckpointDto: UpdateBalanceCheckpointDto,
  ) {
    const balanceCheckpointToUpdate = await this.findOneById(id);
    Object.assign(balanceCheckpointToUpdate, updateBalanceCheckpointDto);
    return this.balanceCheckpointsRepository.save(balanceCheckpointToUpdate);
  }

  async remove(id: string): Promise<BalanceCheckpoint> {
    const balanceCheckpointToRemove = await this.findOneById(id);
    return this.balanceCheckpointsRepository.remove(balanceCheckpointToRemove);
  }
}
