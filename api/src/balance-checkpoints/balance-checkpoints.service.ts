import { Injectable } from '@nestjs/common';
import { CreateBalanceCheckpointDto } from './dto/create-balance-checkpoint.dto';
import { UpdateBalanceCheckpointDto } from './dto/update-balance-checkpoint.dto';

@Injectable()
export class BalanceCheckpointsService {
  create(createBalanceCheckpointDto: CreateBalanceCheckpointDto) {
    return 'This action adds a new balanceCheckpoint';
  }

  findAll() {
    return `This action returns all balanceCheckpoints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} balanceCheckpoint`;
  }

  update(id: number, updateBalanceCheckpointDto: UpdateBalanceCheckpointDto) {
    return `This action updates a #${id} balanceCheckpoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} balanceCheckpoint`;
  }
}
