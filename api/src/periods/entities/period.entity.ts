import { Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
@Unique(['year', 'month']) // Empêche les doublons pour une combinaison spécifique de year/month
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ type: 'int' })
  year: number;

  @Expose()
  @Column({ type: 'varchar' })
  month: string;

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
