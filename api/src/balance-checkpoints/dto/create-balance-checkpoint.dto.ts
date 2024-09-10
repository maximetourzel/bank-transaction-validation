import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBalanceCheckpointDto {
  @ApiProperty({
    example: '2024-09-15',
    description: 'The date of the balance checkpoint',
  })
  @IsNotEmpty()
  @IsISO8601({ strict: false })
  date: Date;

  @ApiProperty({
    example: 1000,
    description: 'The balance of the balance checkpoint',
  })
  @IsNotEmpty()
  @IsNumber()
  balance: number;
}
