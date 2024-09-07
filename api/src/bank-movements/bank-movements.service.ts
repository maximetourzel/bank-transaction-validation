import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankMovementDto } from './dto/create-bank-movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BankMovement } from './entities/bank-movement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BankMovementsService {
  constructor(
    @InjectRepository(BankMovement)
    private readonly bankMovementsRepository: Repository<BankMovement>,
  ) {}
  create(createBankMovementDto: CreateBankMovementDto): Promise<BankMovement> {
    const newBankMovement = this.bankMovementsRepository.create(
      createBankMovementDto,
    );
    return this.bankMovementsRepository.save(newBankMovement);
  }

  findAll() {
    return this.bankMovementsRepository.find();
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
