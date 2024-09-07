import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BankMovementsService } from './bank-movements.service';
import { CreateBankMovementDto } from './dto/create-bank-movement.dto';
import { BankMovement } from './entities/bank-movement.entity';

@Controller('bank-movements')
export class BankMovementsController {
  constructor(private readonly bankMovementsService: BankMovementsService) {}

  @Post()
  create(
    @Body() createBankMovementDto: CreateBankMovementDto,
  ): Promise<BankMovement> {
    return this.bankMovementsService.create(createBankMovementDto);
  }

  @Get()
  findAll(): Promise<BankMovement[]> {
    return this.bankMovementsService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.bankMovementsService.remove(id);
  }
}
