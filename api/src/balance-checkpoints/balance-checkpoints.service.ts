import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBalanceCheckpointDto } from './dto/create-balance-checkpoint.dto';
import { UpdateBalanceCheckpointDto } from './dto/update-balance-checkpoint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceCheckpoint } from './entities/balance-checkpoint.entity';
import { Repository } from 'typeorm';
import { PeriodsService } from '../periods/periods.service';

@Injectable()
export class BalanceCheckpointsService {
  constructor(
    @InjectRepository(BalanceCheckpoint)
    private readonly balanceCheckpointsRepository: Repository<BalanceCheckpoint>,
    private readonly periodsService: PeriodsService,
  ) {}

  /**
   * Creates a new balance checkpoint for a given period.
   *
   * @param periodId The id of the period for the balance checkpoint.
   * @param createBalanceCheckpointDto The data for the new balance checkpoint.
   * @returns The newly created balance checkpoint.
   */
  async create(
    periodId: string,
    createBalanceCheckpointDto: CreateBalanceCheckpointDto,
  ): Promise<BalanceCheckpoint> {
    const period = await this.periodsService.findOneById(periodId);
    const periodStartDate = period.startDate;
    const periodEndDate = period.endDate;
    if (
      createBalanceCheckpointDto.date < periodStartDate ||
      createBalanceCheckpointDto.date > periodEndDate
    ) {
      throw new BadRequestException( 
        `The date ${createBalanceCheckpointDto.date} is not in the period ${periodStartDate} - ${periodEndDate}`
      )
    }

    const newBalanceCheckpoint = this.balanceCheckpointsRepository.create({
      ...createBalanceCheckpointDto,
      period,
    });
    return this.balanceCheckpointsRepository.save(newBalanceCheckpoint);
  }

  /**
   * Finds all balance checkpoints for a given period.
   *
   * @param periodId The id of the period to find balance checkpoints for.
   * @returns An array of balance checkpoints for the given period.
   */
  findByPeriodId(periodId: string): Promise<BalanceCheckpoint[]> {
    return this.balanceCheckpointsRepository.find({
      where: { period: { id: periodId } },
    });
  }

  /**
   * Finds a balance checkpoint by id.
   *
   * @param id The id of the balance checkpoint to find.
   * @returns The balance checkpoint with the given id.
   * @throws {NotFoundException} If no balance checkpoint with the given id exists.
   */
  async findOneById(id: string): Promise<BalanceCheckpoint> {
    const balanceCheckpoint = await this.balanceCheckpointsRepository.findOneBy(
      {
        id,
      },
    );
    if (!balanceCheckpoint) {
      throw new NotFoundException(`BalanceCheckpoint with id ${id} not found`);
    }
    return balanceCheckpoint;
  }

  /**
   * Updates a balance checkpoint.
   *
   * @param id The id of the balance checkpoint to update.
   * @param updateBalanceCheckpointDto The data to update the balance checkpoint with.
   * @returns The updated balance checkpoint.
   * @throws {NotFoundException} If no balance checkpoint with the given id exists.
   */
  async update(
    id: string,
    updateBalanceCheckpointDto: UpdateBalanceCheckpointDto,
  ) {
    const balanceCheckpointToUpdate = await this.findOneById(id);
    Object.assign(balanceCheckpointToUpdate, updateBalanceCheckpointDto);
    return this.balanceCheckpointsRepository.save(balanceCheckpointToUpdate);
  }

  /**
   * Removes a balance checkpoint.
   *
   * @param id The id of the balance checkpoint to remove.
   * @returns The removed balance checkpoint.
   * @throws {NotFoundException} If no balance checkpoint with the given id exists.
   */
  async remove(id: string): Promise<BalanceCheckpoint> {
    const balanceCheckpointToRemove = await this.findOneById(id);
    return this.balanceCheckpointsRepository.remove(balanceCheckpointToRemove);
  }
}
