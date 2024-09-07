import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBankMovementDto {
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  wording: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
