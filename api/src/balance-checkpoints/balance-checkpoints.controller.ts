import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BalanceCheckpointsService } from './balance-checkpoints.service';
import { CreateBalanceCheckpointDto } from './dto/create-balance-checkpoint.dto';
import { UpdateBalanceCheckpointDto } from './dto/update-balance-checkpoint.dto';

@Controller('balance-checkpoints')
export class BalanceCheckpointsController {
  constructor(private readonly balanceCheckpointsService: BalanceCheckpointsService) {}

  @Post()
  create(@Body() createBalanceCheckpointDto: CreateBalanceCheckpointDto) {
    return this.balanceCheckpointsService.create(createBalanceCheckpointDto);
  }

  @Get()
  findAll() {
    return this.balanceCheckpointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.balanceCheckpointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBalanceCheckpointDto: UpdateBalanceCheckpointDto) {
    return this.balanceCheckpointsService.update(+id, updateBalanceCheckpointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.balanceCheckpointsService.remove(+id);
  }
}
