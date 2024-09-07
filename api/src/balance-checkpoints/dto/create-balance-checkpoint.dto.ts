import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBalanceCheckpointDto {
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  balance: number;
}
