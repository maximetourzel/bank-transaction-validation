import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { PeriodMonth } from '../enums/period-month.enum';

@Entity()
@Unique(['year', 'month']) // Empêche les doublons pour une combinaison spécifique de year/month
export class Period {
  @ApiProperty({
    example: 'b2c8c9b6-0b7a-4a6f-9c1d-2e3f4a5b6c7d',
    description: 'The id of the period',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 2024,
    description: 'The year of the period',
  })
  @Expose()
  @Column({ type: 'int' })
  year: number;

  @ApiProperty({
    enum: PeriodMonth,
    example: 'septembre',
    description: 'The month of the period',
  })
  @Expose()
  @Column({ type: 'varchar' })
  month: string;

  @ApiProperty({
    example: '2024-09-01',
    description: 'The start date of the period',
  })
  @Expose()
  @Column({ type: 'date' })
  startDate: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setStartDate() {
    this.startDate = new Date(
      this.year,
      Period.convertMonthStringToNumber(this.month) - 1,
      1,
    );
  }

  @ApiProperty({
    example: '2024-09-30',
    description: 'The end date of the period',
  })
  @Expose()
  @Column({ type: 'date' })
  endDate: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setEndDate() {
    this.endDate = new Date(
      this.year,
      Period.convertMonthStringToNumber(this.month),
      0,
    );
  }

  private static convertMonthStringToNumber(month: string): number {
    const months = {
      janvier: 1,
      février: 2,
      mars: 3,
      avril: 4,
      mai: 5,
      juin: 6,
      juillet: 7,
      août: 8,
      septembre: 9,
      octobre: 10,
      novembre: 11,
      décembre: 12,
    };
    return months[month.toLowerCase()];
  }
}
