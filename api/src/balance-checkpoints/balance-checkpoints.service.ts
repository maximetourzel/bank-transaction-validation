import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBalanceCheckpointDto } from './dto/create-balance-checkpoint.dto';
import { UpdateBalanceCheckpointDto } from './dto/update-balance-checkpoint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceCheckpoint } from './entities/balance-checkpoint.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BalanceCheckpointsService {
  constructor(
    @InjectRepository(BalanceCheckpoint)
    private readonly balanceCheckpointsRepository: Repository<BalanceCheckpoint>,
  ) {}
  create(
    createBalanceCheckpointDto: CreateBalanceCheckpointDto,
  ): Promise<BalanceCheckpoint> {
    const newBalanceCheckpoint = this.balanceCheckpointsRepository.create(
      createBalanceCheckpointDto,
    );
    return this.balanceCheckpointsRepository.save(newBalanceCheckpoint);
  }

  findAll(): Promise<BalanceCheckpoint[]> {
    return this.balanceCheckpointsRepository.find();
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
