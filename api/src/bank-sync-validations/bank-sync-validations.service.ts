import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceCheckpoint } from 'src/balance-checkpoints/entities/balance-checkpoint.entity';
import { BankMovement } from 'src/bank-movements/entities/bank-movement.entity';
import { Repository } from 'typeorm';
import { BankSyncValidation } from './entities/bank-sync-validation.entity';
import {
  BalanceMismatchError,
  MissingCheckpointError,
  MissingMovementsError,
  PotentialMovementDuplicateError,
  ValidationError,
} from './interfaces/validation-error.interface';
import { PeriodsService } from 'src/periods/periods.service';
import { BankMovementsService } from 'src/bank-movements/bank-movements.service';
import { BalanceCheckpointsService } from 'src/balance-checkpoints/balance-checkpoints.service';
import { ValidationErrorType } from './enums/validation-error-type.enum';

@Injectable()
export class BankSyncValidationsService {
  constructor(
    @InjectRepository(BankSyncValidation)
    private readonly bankSyncValidationRepository: Repository<BankSyncValidation>,
    private readonly periodsService: PeriodsService,
    private readonly bankMovementsService: BankMovementsService,
    private readonly balanceCheckpointsService: BalanceCheckpointsService,
  ) {}

  async findAll(): Promise<BankSyncValidation[]> {
    return this.bankSyncValidationRepository.find({
      relations: {
        period: true,
        movements: true,
        checkpoints: true,
      },
    });
  }

  findOneByPeriodId(periodId: string): Promise<BankSyncValidation> {
    return this.bankSyncValidationRepository.findOne({
      where: { period: { id: periodId } },
    });
  }

  async findOne(id: string): Promise<BankSyncValidation> {
    const validation = await this.bankSyncValidationRepository.findOneBy({
      id,
    });
    if (!validation) {
      throw new NotFoundException(`Validation with id ${id} not found`);
    }
    return validation;
  }

  async create(periodId: string) {
    const existingValidation = await this.findOneByPeriodId(periodId);
    if (existingValidation) {
      existingValidation.isHistorical = true;
      await this.bankSyncValidationRepository.save(existingValidation);
    }

    const period = await this.periodsService.findOneById(periodId);

    const movements = await this.bankMovementsService.findByPeriodId(periodId);

    const checkpoints =
      await this.balanceCheckpointsService.findByPeriodId(periodId);

    const { isValid, errors } = this.validateMovementsAgainstCheckpoints(
      movements,
      checkpoints,
    );

    const validationResult = this.bankSyncValidationRepository.create({
      period,
      isValid,
      validationErrors: errors,
      movements,
      checkpoints,
      previousValidation: existingValidation,
    });
    return this.bankSyncValidationRepository.save(validationResult);
  }

  private validateMovementsAgainstCheckpoints(
    movements: BankMovement[],
    checkpoints: BalanceCheckpoint[],
  ): { isValid: boolean; errors: ValidationError[] } {
    const errors: ValidationError[] = [];

    const missingMovementsErrors = this.checkMissingMovements(movements);
    if (missingMovementsErrors) {
      errors.push(missingMovementsErrors);
    }

    const missingCheckpointsErrors = this.checkMissingCheckpoints(checkpoints);
    if (missingCheckpointsErrors) {
      errors.push(missingCheckpointsErrors);
    }

    const balanceMismatchError = this.checkBalanceMismatch(
      checkpoints,
      movements,
    );
    if (balanceMismatchError) {
      errors.push(balanceMismatchError);
    }

    errors.push(...this.checkDuplicateMovements(movements));

    return { isValid: errors.length === 0, errors };
  }

  private checkMissingCheckpoints(
    checkpoints: BalanceCheckpoint[],
  ): MissingCheckpointError {
    if (checkpoints.length === 0) {
      return {
        type: ValidationErrorType.MISSING_CHECKPOINT,
        message: 'No checkpoints found',
      };
    }
  }

  private checkMissingMovements(
    movements: BankMovement[],
  ): MissingMovementsError {
    if (movements.length === 0) {
      return {
        type: ValidationErrorType.MISSING_MOVEMENTS,
        message: 'No movements found',
      };
    }
  }

  private checkBalanceMismatch(
    checkpoints: BalanceCheckpoint[],
    movements: BankMovement[],
  ): BalanceMismatchError {
    // TODO: get most recent checkpoint balance
    const finalBalance = checkpoints[checkpoints.length - 1].balance;
    const calculatedBalance = movements.reduce(
      (acc, movement) => acc + movement.amount,
      0,
    );

    if (finalBalance !== calculatedBalance) {
      return {
        type: ValidationErrorType.BALANCE_MISMATCH,
        message: 'Final balance does not match calculated balance',
        expectedBalance: finalBalance,
        actualBalance: calculatedBalance,
      };
    }
  }

  private checkDuplicateMovements(
    movements: BankMovement[],
  ): PotentialMovementDuplicateError[] {
    const errors: PotentialMovementDuplicateError[] = [];
    const seenMovements = new Map<string, string[]>();
    movements.forEach((movement) => {
      const key = `${movement.date}-${movement.amount}-${movement.wording}`;

      if (seenMovements.has(key)) {
        // Si la clé existe déjà, ajoute l'ID à la liste
        seenMovements.get(key)?.push(movement.id);

        // Vérifie si l'erreur existe déjà
        const existingErrorIndex = errors.findIndex((error) =>
          error.movementIds.includes(movement.id),
        );

        if (existingErrorIndex === -1) {
          errors.push({
            type: ValidationErrorType.POTENTIAL_MOVEMENT_DUPLICATE,
            message: `Potential duplicate movements detected for date:  ${movement.date}, amount: ${movement.amount}, wording: ${movement.wording}`,
            movementIds: seenMovements.get(key)!, // Stocke tous les IDs des doublons
          });
        }
      } else {
        seenMovements.set(key, [movement.id]);
      }
    });
    return errors;
  }

  async remove(id: string) {
    const validation = await this.findOne(id);
    await this.bankSyncValidationRepository.remove(validation);
  }
}
