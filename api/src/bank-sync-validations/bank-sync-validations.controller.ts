import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BankSyncValidationsService } from './bank-sync-validations.service';
import { BankSyncValidation } from './entities/bank-sync-validation.entity';

@Controller()
export class BankSyncValidationsController {
  constructor(
    private readonly bankSyncValidationsService: BankSyncValidationsService,
  ) {}

  @Post('periods/:periodId/validations')
  create(@Param('periodId') periodId: string): Promise<BankSyncValidation> {
    return this.bankSyncValidationsService.create(periodId);
  }

  @Get('periods/:periodId/validations')
  findOneByPeriod(
    @Param('periodId') periodId: string,
  ): Promise<BankSyncValidation> {
    return this.bankSyncValidationsService.findOneByPeriodId(periodId);
  }

  @Get('validations/:validationId')
  findOne(
    @Param('validationId') validationId: string,
  ): Promise<BankSyncValidation> {
    return this.bankSyncValidationsService.findOne(validationId);
  }

  @Delete('validations/:validationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('validationId') validationId: string): Promise<void> {
    await this.bankSyncValidationsService.remove(validationId);
  }
}
