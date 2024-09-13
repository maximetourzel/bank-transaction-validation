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
  ParseUUIDPipe,
} from '@nestjs/common';
import { BalanceCheckpointsService } from './balance-checkpoints.service';
import { CreateBalanceCheckpointDto } from './dto/create-balance-checkpoint.dto';
import { UpdateBalanceCheckpointDto } from './dto/update-balance-checkpoint.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BalanceCheckpoint } from './entities/balance-checkpoint.entity';

@ApiTags('balance-checkpoints')
@Controller()
export class BalanceCheckpointsController {
  constructor(
    private readonly balanceCheckpointsService: BalanceCheckpointsService,
  ) {}

  @ApiCreatedResponse({
    type: BalanceCheckpoint,
    description: 'The balance checkpoint has been successfully created',
  })
  @Post('periods/:periodId/checkpoints')
  create(
    @Param('periodId', new ParseUUIDPipe()) periodId: string,
    @Body() createBalanceCheckpointDto: CreateBalanceCheckpointDto,
  ): Promise<BalanceCheckpoint> {
    return this.balanceCheckpointsService.create(
      periodId,
      createBalanceCheckpointDto,
    );
  }

  @ApiOkResponse({
    type: BalanceCheckpoint,
    description: 'The list of balance checkpoints for the period',
  })
  @Get('periods/:periodId/checkpoints')
  findAllForPeriod(@Param('periodId', new ParseUUIDPipe()) periodId: string) {
    return this.balanceCheckpointsService.findByPeriodId(periodId);
  }

  @ApiOkResponse({
    type: BalanceCheckpoint,
    description: 'The balance checkpoint with the given id',
  })
  @Get('checkpoints/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.balanceCheckpointsService.findOneById(id);
  }

  @ApiOkResponse({
    type: BalanceCheckpoint,
    description: 'The balance checkpoint has been successfully updated',
  })
  @Patch('checkpoints/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateBalanceCheckpointDto: UpdateBalanceCheckpointDto,
  ) {
    return this.balanceCheckpointsService.update(
      id,
      updateBalanceCheckpointDto,
    );
  }

  @ApiNoContentResponse({
    description: 'The balance checkpoint has been successfully removed',
  })
  @ApiNotFoundResponse({
    description: 'The balance checkpoint was not found',
  })
  @Delete('checkpoints/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.balanceCheckpointsService.remove(id);
  }
}
