import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankMovementsService } from './bank-movements.service';
import { CreateBankMovementDto } from './dto/create-bank-movement.dto';
import { UpdateBankMovementDto } from './dto/update-bank-movement.dto';

@Controller('bank-movements')
export class BankMovementsController {
  constructor(private readonly bankMovementsService: BankMovementsService) {}

  @Post()
  create(@Body() createBankMovementDto: CreateBankMovementDto) {
    return this.bankMovementsService.create(createBankMovementDto);
  }

  @Get()
  findAll() {
    return this.bankMovementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankMovementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankMovementDto: UpdateBankMovementDto) {
    return this.bankMovementsService.update(+id, updateBankMovementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankMovementsService.remove(+id);
  }
}
