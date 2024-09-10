import { BankSyncValidation } from 'src/bank-sync-validations/entities/bank-sync-validation.entity';
import { Period } from 'src/periods/entities/period.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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

  @ManyToOne(() => BankSyncValidation, (validation) => validation.movements)
  validation: BankSyncValidation;

  @ManyToOne(() => Period)
  @JoinColumn({ name: 'periodId' })
  period: Period;
}
