import { IsInt, IsNotEmpty, IsString, Min, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => {
    const months = [
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
    ];
    return months.indexOf(value.toLowerCase()) + 1;
  })
  readonly month: number;
}
