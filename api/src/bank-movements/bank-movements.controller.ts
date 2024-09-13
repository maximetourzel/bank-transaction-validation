import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BankMovementsService } from './bank-movements.service';
import { CreateBankMovementDto } from './dto/create-bank-movement.dto';
import { BankMovement } from './entities/bank-movement.entity';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('bank-movements')
@Controller()
export class BankMovementsController {
  constructor(private readonly bankMovementsService: BankMovementsService) {}

  @ApiCreatedResponse({
    type: BankMovement,
    description: 'Bank movement created successfully',
  })
  @Post('periods/:periodId/movements')
  create(
    @Param('periodId', new ParseUUIDPipe()) periodId: string,
    @Body() createBankMovementDto: CreateBankMovementDto,
  ): Promise<BankMovement> {
    return this.bankMovementsService.create(periodId, createBankMovementDto);
  }

  @ApiOkResponse({
    type: [BankMovement],
    description: 'Bank movements retrieved successfully',
  })
  @Get('periods/:periodId/movements')
  findAllForPeriod(
    @Param('periodId', new ParseUUIDPipe()) periodId: string,
  ): Promise<BankMovement[]> {
    return this.bankMovementsService.findAllForPeriod(periodId);
  }

  @ApiNoContentResponse({
    description: 'Bank movements deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Bank movement not found',
  })
  @Delete('movements/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.bankMovementsService.remove(id);
  }
}
