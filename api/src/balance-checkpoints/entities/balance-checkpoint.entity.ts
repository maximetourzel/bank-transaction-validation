import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BalanceCheckpoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float' })
  balance: number;
}
