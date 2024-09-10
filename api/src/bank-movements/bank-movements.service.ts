import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankMovementDto } from './dto/create-bank-movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BankMovement } from './entities/bank-movement.entity';
import { Repository } from 'typeorm';
import { PeriodsService } from 'src/periods/periods.service';

@Injectable()
export class BankMovementsService {
  constructor(
    @InjectRepository(BankMovement)
    private readonly bankMovementsRepository: Repository<BankMovement>,
    private readonly periodsService: PeriodsService,
  ) {}
  async create(
    periodId: string,
    createBankMovementDto: CreateBankMovementDto,
  ): Promise<BankMovement> {
    const period = await this.periodsService.findOneById(periodId);
    //TODO: verify if createBankMovementDto.date is in period

    const newBankMovement = this.bankMovementsRepository.create({
      ...createBankMovementDto,
      period,
    });
    return this.bankMovementsRepository.save(newBankMovement);
  }

  findAllForPeriod(periodId: string): Promise<BankMovement[]> {
    return this.bankMovementsRepository.find({
      where: { period: { id: periodId } },
    });
  }

  findByPeriodId(periodId: string): Promise<BankMovement[]> {
    return this.bankMovementsRepository.find({
      where: { period: { id: periodId } },
    });
  }

  findOneById(id: string): Promise<BankMovement> {
    const bankMovement = this.bankMovementsRepository.findOneBy({ id });
    if (!bankMovement) {
      throw new NotFoundException(`BankMovement with id ${id} not found`);
    }
    return bankMovement;
  }

  async remove(id: string): Promise<BankMovement> {
    const bmToRemove = await this.findOneById(id);
    return this.bankMovementsRepository.remove(bmToRemove);
  }
}
