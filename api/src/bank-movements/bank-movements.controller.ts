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

@Controller()
export class BankMovementsController {
  constructor(private readonly bankMovementsService: BankMovementsService) {}

  @Post('periods/:periodId/movements')
  create(
    @Param('periodId') periodId: string,
    @Body() createBankMovementDto: CreateBankMovementDto,
  ): Promise<BankMovement> {
    return this.bankMovementsService.create(periodId, createBankMovementDto);
  }

  @Get('periods/:periodId/movements')
  findAllForPeriod(
    @Param('periodId') periodId: string,
  ): Promise<BankMovement[]> {
    return this.bankMovementsService.findAllForPeriod(periodId);
  }

  @Delete('movements/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.bankMovementsService.remove(id);
  }
}
