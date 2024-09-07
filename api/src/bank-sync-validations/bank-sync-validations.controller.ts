import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankSyncValidationsService } from './bank-sync-validations.service';
import { CreateBankSyncValidationDto } from './dto/create-bank-sync-validation.dto';
import { UpdateBankSyncValidationDto } from './dto/update-bank-sync-validation.dto';

@Controller('bank-sync-validations')
export class BankSyncValidationsController {
  constructor(private readonly bankSyncValidationsService: BankSyncValidationsService) {}

  @Post()
  create(@Body() createBankSyncValidationDto: CreateBankSyncValidationDto) {
    return this.bankSyncValidationsService.create(createBankSyncValidationDto);
  }

  @Get()
  findAll() {
    return this.bankSyncValidationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankSyncValidationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankSyncValidationDto: UpdateBankSyncValidationDto) {
    return this.bankSyncValidationsService.update(+id, updateBankSyncValidationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankSyncValidationsService.remove(+id);
  }
}
