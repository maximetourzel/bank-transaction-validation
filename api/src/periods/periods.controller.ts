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
import { Period } from './entities/period.entity';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Periods')
@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @ApiCreatedResponse({
    type: Period,
    description: 'The period was created successfully',
  })
  @ApiConflictResponse({ description: 'The period already exists' })
  @Post()
  create(@Body() createPeriodDto: CreatePeriodDto): Promise<Period> {
    return this.periodsService.create(createPeriodDto);
  }

  @ApiOkResponse({
    type: Period,
    isArray: true,
    description: 'The periods were retrieved successfully',
  })
  @Get()
  findAll(): Promise<Period[]> {
    return this.periodsService.findAll();
  }

  @ApiOkResponse({
    type: Period,
    description: 'The period was retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'The period was not found' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Period> {
    return this.periodsService.findOneById(id);
  }

  @ApiNoContentResponse({ description: 'The period was deleted successfully' })
  @ApiNotFoundResponse({ description: 'The period was not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.periodsService.remove(id);
  }
}
