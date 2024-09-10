import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BankMovement } from 'src/bank-movements/entities/bank-movement.entity';
import { BalanceCheckpoint } from 'src/balance-checkpoints/entities/balance-checkpoint.entity';
import { Period } from 'src/periods/entities/period.entity';
import { ValidationError } from '../interfaces/validation-error.interface';

@Entity()
export class BankSyncValidation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Period)
  @JoinColumn({ name: 'periodId' })
  period: Period;

  @Column({ type: 'boolean', default: false })
  isValid: boolean;

  @Column({ type: 'json', nullable: true })
  validationErrors: ValidationError[];

  @OneToMany(() => BankMovement, (movement) => movement.validation)
  @JoinColumn()
  movements: BankMovement[];

  @OneToMany(() => BalanceCheckpoint, (checkpoint) => checkpoint.validation)
  @JoinColumn()
  checkpoints: BalanceCheckpoint[];

  @ManyToOne(() => BankSyncValidation)
  @JoinColumn({ name: 'previousValidationId' })
  previousValidation: BankSyncValidation;

  @Column({ type: 'boolean', default: false })
  isHistorical: boolean;
}
