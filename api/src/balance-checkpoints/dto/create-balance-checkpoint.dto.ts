import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBalanceCheckpointDto {
  @IsNotEmpty()
  @IsISO8601({ strict: false })
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  balance: number;
}
