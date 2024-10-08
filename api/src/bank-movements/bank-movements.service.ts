import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankMovementDto } from './dto/create-bank-movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BankMovement } from './entities/bank-movement.entity';
import { Repository } from 'typeorm';
import { PeriodsService } from '../periods/periods.service';

@Injectable()
export class BankMovementsService {
  constructor(
    @InjectRepository(BankMovement)
    private readonly bankMovementsRepository: Repository<BankMovement>,
    private readonly periodsService: PeriodsService,
  ) {}

  /**
   * Creates a new bank movement in the given period
   * @param periodId the id of the period
   * @param createBankMovementDto the data of the new bank movement
   * @returns the created bank movement
   * @throws {NotFoundException} if the period is not found
   */
  async create(
    periodId: string,
    createBankMovementDto: CreateBankMovementDto,
  ): Promise<BankMovement> {
    const period = await this.periodsService.findOneById(periodId);
    if (createBankMovementDto.date < period.startDate || createBankMovementDto.date > period.endDate) {
      throw new BadRequestException(
        `The date of the bank movement is not in the period`,
      );
    }

    const newBankMovement = this.bankMovementsRepository.create({
      ...createBankMovementDto,
      period,
    });
    return this.bankMovementsRepository.save(newBankMovement);
  }

  /**
   * Finds all bank movements for the given period
   * @param periodId the id of the period
   * @returns a promise of an array of bank movements
   */
  async findAllForPeriod(periodId: string): Promise<BankMovement[]> {
    await this.periodsService.findOneById(periodId);
    return this.bankMovementsRepository.find({
      where: { period: { id: periodId } },
    });
  }

  /**
   * Finds all bank movements for the given period
   * @param periodId the id of the period
   * @returns a promise of an array of bank movements
   */
  async findByPeriodId(periodId: string): Promise<BankMovement[]> {
    await this.periodsService.findOneById(periodId);
    return this.bankMovementsRepository.find({
      where: { period: { id: periodId } },
    });
  }

  /**
   * Finds a bank movement by its id
   * @param id the id of the bank movement to find
   * @returns a promise of the bank movement
   * @throws {NotFoundException} if the bank movement with the given id is not found
   */
  async findOneById(id: string): Promise<BankMovement> {
    const bankMovement = await this.bankMovementsRepository.findOneBy({ id });
    if (!bankMovement) {
      throw new NotFoundException(`BankMovement with id ${id} not found`);
    }
    return bankMovement;
  }

  /**
   * Removes a bank movement
   * @param id the id of the bank movement to remove
   * @returns the removed bank movement
   * @throws {NotFoundException} if the bank movement with the given id is not found
   */
  async remove(id: string): Promise<BankMovement> {
    const bmToRemove = await this.findOneById(id);
    return this.bankMovementsRepository.remove(bmToRemove);
  }
}
