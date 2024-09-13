import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { BankSyncValidationsService } from './bank-sync-validations.service';
import { BankSyncValidation } from './entities/bank-sync-validation.entity';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('validations')
@Controller()
export class BankSyncValidationsController {
  constructor(
    private readonly bankSyncValidationsService: BankSyncValidationsService,
  ) {}

  @ApiCreatedResponse({
    type: BankSyncValidation,
    description: 'The validation has been successfully created',
  })
  @ApiNotFoundResponse({
    description: 'The period with the given id was not found',
  })
  @Post('periods/:periodId/validations')
  create(@Param('periodId', new ParseUUIDPipe()) periodId: string): Promise<BankSyncValidation> {
    return this.bankSyncValidationsService.create(periodId);
  }

  @ApiOkResponse({
    type: [BankSyncValidation],
    description: 'The list of validations for the period',
  })
  @Get('periods/:periodId/validations')
  findAllByPeriodId(
    @Param('periodId', new ParseUUIDPipe()) periodId: string,
  ): Promise<BankSyncValidation[]> {
    return this.bankSyncValidationsService.findAllByPeriodId(periodId);
  }

  @ApiOkResponse({
    description: 'The validation with the given id',
    type: BankSyncValidation,
  })
  @ApiNotFoundResponse({
    description: 'The validation with the given id was not found',
  })
  @Get('validations/:validationId')
  findOne(
    @Param('validationId', new ParseUUIDPipe()) validationId: string,
  ): Promise<BankSyncValidation> {
    return this.bankSyncValidationsService.findOne(validationId);
  }

  @ApiNoContentResponse({
    description: 'The validation has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'The validation with the given id was not found',
  })
  @Delete('validations/:validationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('validationId', new ParseUUIDPipe()) validationId: string): Promise<void> {
    await this.bankSyncValidationsService.remove(validationId);
  }
}
