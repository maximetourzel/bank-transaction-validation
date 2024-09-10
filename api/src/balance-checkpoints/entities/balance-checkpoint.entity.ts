import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
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
export class BalanceCheckpoint {
  @ApiProperty({
    description: 'The unique id of the balance checkpoint',
    example: '1a0b0c0d-2e0f-3g0h-4i0j-5k0l0m0n0o0p0',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The date of the balance checkpoint',
    example: '2024-09-30',
  })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({
    description: 'The balance of the balance checkpoint',
    example: 1000,
  })
  @Column({ type: 'float' })
  balance: number;

  @ApiHideProperty()
  @ManyToOne(() => BankSyncValidation, (validation) => validation.checkpoints)
  validation: BankSyncValidation;

  @ApiHideProperty()
  @ManyToOne(() => Period)
  @JoinColumn({ name: 'periodId' })
  period: Period;
}
