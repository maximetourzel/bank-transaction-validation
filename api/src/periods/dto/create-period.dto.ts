import { IsInt, IsNotEmpty, IsString, Min, IsIn } from 'class-validator';

export class CreatePeriodDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1900)
  readonly year: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ])
  readonly month: string;
}
