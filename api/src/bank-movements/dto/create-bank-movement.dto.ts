import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBankMovementDto {
  @ApiProperty({
    description: 'The date of the bank movement',
    example: '2024-09-15',
  })
  @IsNotEmpty()
  @IsISO8601({ strict: false })
  date: Date;

  @ApiProperty({
    description: 'The wording of the bank movement',
    example: 'Salary',
  })
  @IsNotEmpty()
  @IsString()
  wording: string;

  @ApiProperty({
    description: 'The amount of the bank movement',
    example: 3000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
