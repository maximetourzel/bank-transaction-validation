import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BalanceCheckpointsService } from './balance-checkpoints.service';
import { CreateBalanceCheckpointDto } from './dto/create-balance-checkpoint.dto';
import { UpdateBalanceCheckpointDto } from './dto/update-balance-checkpoint.dto';

@Controller()
export class BalanceCheckpointsController {
  constructor(
    private readonly balanceCheckpointsService: BalanceCheckpointsService,
  ) {}

  @Post('periods/:periodId/checkpoints')
  create(
    @Param('periodId') periodId: string,
    @Body() createBalanceCheckpointDto: CreateBalanceCheckpointDto,
  ) {
    return this.balanceCheckpointsService.create(
      periodId,
      createBalanceCheckpointDto,
    );
  }

  @Get('periods/:periodId/checkpoints')
  findAllForPeriod(@Param('periodId') periodId: string) {
    return this.balanceCheckpointsService.findByPeriodId(periodId);
  }

  @Get('checkpoints/:id')
  findOne(@Param('id') id: string) {
    return this.balanceCheckpointsService.findOneById(id);
  }

  @Patch('checkpoints/:id')
  update(
    @Param('id') id: string,
    @Body() updateBalanceCheckpointDto: UpdateBalanceCheckpointDto,
  ) {
    return this.balanceCheckpointsService.update(
      id,
      updateBalanceCheckpointDto,
    );
  }

  @Delete('checkpoints/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.balanceCheckpointsService.remove(id);
  }
}
