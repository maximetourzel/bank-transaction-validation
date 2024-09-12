import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { BankSyncValidation } from '../../bank-sync-validations/entities/bank-sync-validation.entity';
import { Period } from '../../periods/entities/period.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BankMovement {
  @ApiProperty({
    description: 'The id of the bank movement',
    example: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The date of the bank movement',
    example: '2024-09-15',
  })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({
    description: 'The wording of the bank movement',
    example: 'Salary',
  })
  @Column()
  wording: string;

  @ApiProperty({
    description: 'The amount of the bank movement',
    example: 3000,
  })
  @Column({ type: 'float' })
  amount: number;

  @ApiHideProperty()
  @ManyToOne(() => BankSyncValidation, (validation) => validation.movements)
  validation: BankSyncValidation;

  @ApiHideProperty()
  @ManyToOne(() => Period)
  @JoinColumn({ name: 'periodId' })
  period: Period;

  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}
