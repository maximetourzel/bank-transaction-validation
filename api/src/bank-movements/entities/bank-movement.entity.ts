import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BankMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  wording: string;

  @Column({ type: 'float' })
  amount: number;
}
