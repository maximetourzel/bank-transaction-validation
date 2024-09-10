import { IsISO8601, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBankMovementDto {
  @IsNotEmpty()
  @IsISO8601({ strict: false })
  date: Date;

  @IsNotEmpty()
  @IsString()
  wording: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
