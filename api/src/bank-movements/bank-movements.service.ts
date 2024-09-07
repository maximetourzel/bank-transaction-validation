import { Injectable } from '@nestjs/common';
import { CreateBankMovementDto } from './dto/create-bank-movement.dto';
import { UpdateBankMovementDto } from './dto/update-bank-movement.dto';

@Injectable()
export class BankMovementsService {
  create(createBankMovementDto: CreateBankMovementDto) {
    return 'This action adds a new bankMovement';
  }

  findAll() {
    return `This action returns all bankMovements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bankMovement`;
  }

  update(id: number, updateBankMovementDto: UpdateBankMovementDto) {
    return `This action updates a #${id} bankMovement`;
  }

  remove(id: number) {
    return `This action removes a #${id} bankMovement`;
  }
}
