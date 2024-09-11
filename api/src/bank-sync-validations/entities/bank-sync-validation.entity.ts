import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BankMovement } from '../../bank-movements/entities/bank-movement.entity';
import { BalanceCheckpoint } from '../../balance-checkpoints/entities/balance-checkpoint.entity';
import { Period } from '../../periods/entities/period.entity';
import { ValidationError } from '../models/validation-error';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity()
export class BankSyncValidation {
  @ApiProperty({
    description: 'The unique id of the bank sync validation',
    example: '1a0b0c0d-2e0f-3g0h-4i0j-5k0l0m0n0o0p0',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiHideProperty()
  @ManyToOne(() => Period)
  @JoinColumn({ name: 'periodId' })
  period: Period;

  @ApiProperty({
    description: 'Whether the validation is valid or not',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  isValid: boolean;

  @ApiProperty({
    description: 'The list of validation errors',
  })
  @Column({ type: 'json', nullable: true })
  validationErrors: ValidationError[];

  @ApiProperty({
    description: 'The list of bank movements',
  })
  @OneToMany(() => BankMovement, (movement) => movement.validation)
  @JoinColumn()
  movements: BankMovement[];

  @ApiProperty({
    description: 'The list of balance checkpoints',
  })
  @OneToMany(() => BalanceCheckpoint, (checkpoint) => checkpoint.validation)
  @JoinColumn()
  checkpoints: BalanceCheckpoint[];

  @ApiProperty({
    description: 'The previous validation',
  })
  @ManyToOne(() => BankSyncValidation)
  @JoinColumn({ name: 'previousValidationId' })
  previousValidation: BankSyncValidation;

  @ApiProperty({
    description: 'Whether the validation is historical or not',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  isHistorical: boolean;
}
