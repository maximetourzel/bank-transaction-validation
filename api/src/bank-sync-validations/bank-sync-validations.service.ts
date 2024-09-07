import { Injectable } from '@nestjs/common';
import { CreateBankSyncValidationDto } from './dto/create-bank-sync-validation.dto';
import { UpdateBankSyncValidationDto } from './dto/update-bank-sync-validation.dto';

@Injectable()
export class BankSyncValidationsService {
  create(createBankSyncValidationDto: CreateBankSyncValidationDto) {
    return 'This action adds a new bankSyncValidation';
  }

  findAll() {
    return `This action returns all bankSyncValidations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bankSyncValidation`;
  }

  update(id: number, updateBankSyncValidationDto: UpdateBankSyncValidationDto) {
    return `This action updates a #${id} bankSyncValidation`;
  }

  remove(id: number) {
    return `This action removes a #${id} bankSyncValidation`;
  }
}
