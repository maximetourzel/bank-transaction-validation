import { IsInt, IsNotEmpty, IsString, Min, IsEnum } from 'class-validator';
import { PeriodMonth } from '../enums/period-month.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePeriodDto {
  @ApiProperty({
    description: 'The year of the period',
    example: 2024,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1900)
  readonly year: number;

  @ApiProperty({
    enum: PeriodMonth,
    description: 'The month of the period',
    example: 'septembre',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(PeriodMonth)
  readonly month: PeriodMonth;
}
