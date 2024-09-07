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
import { PeriodsService } from './periods.service';
import { CreatePeriodDto } from './dto/create-period.dto';

@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Post()
  create(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodsService.create(createPeriodDto);
  }

  @Get()
  findAll() {
    return this.periodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodsService.findOneById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.periodsService.remove(id);
  }
}
