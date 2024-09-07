import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['year', 'month']) // Empêche les doublons pour une combinaison spécifique de year/month
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'date' })
  get startDate(): Date {
    return new Date(this.year, this.month - 1, 1);
  }

  @Column({ type: 'date' })
  get endDate(): Date {
    return new Date(this.year, this.month, 0);
  }
}
