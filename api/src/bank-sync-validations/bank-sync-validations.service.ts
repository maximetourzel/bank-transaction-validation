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

  /**
   * Finds all bank sync validations, with their relations.
   *
   * @returns a promise of an array of bank sync validations
   */
  async findAll(): Promise<BankSyncValidation[]> {
    return this.bankSyncValidationRepository.find({
      relations: {
        period: true,
        movements: true,
        checkpoints: true,
      },
    });
  }

  /**
   * Finds a bank sync validation by its period id.
   *
   * @param periodId the id of the period to find the validation for
   * @returns a promise of the bank sync validation
   */
  findOneByPeriodId(periodId: string): Promise<BankSyncValidation> {
    return this.bankSyncValidationRepository.findOne({
      where: { period: { id: periodId } },
    });
  }

  /**
   * Finds a bank sync validation by its id.
   *
   * @param id the id of the bank sync validation to find
   * @returns a promise of the bank sync validation
   * @throws {NotFoundException} if the bank sync validation with the given id is not found
   */
  async findOne(id: string): Promise<BankSyncValidation> {
    const validation = await this.bankSyncValidationRepository.findOneBy({
      id,
    });
    if (!validation) {
      throw new NotFoundException(`Validation with id ${id} not found`);
    }
    return validation;
  }

  /**
   * Creates a new bank sync validation for the given period.
   *
   * If there is already a validation for the given period, it will be marked as
   * historical.
   *
   * The new validation will contain all movements and checkpoints in the given
   * period, and will have the isValid flag set to whether the movements and
   * checkpoints are valid.
   *
   * If the validation is not valid, it will contain the validation errors.
   *
   * @param periodId the id of the period to create the validation for
   * @returns a promise of the newly created bank sync validation
   */
  async create(periodId: string): Promise<BankSyncValidation> {
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

  /**
   * Validates a set of bank movements against a set of balance checkpoints.
   *
   * The validation checks that there are no missing movements, that there are no
   * missing checkpoints, and that the balance of the movements matches the
   * balance of the checkpoints.
   *
   * If the validation is successful, the function returns an object with
   * `isValid` set to `true` and an empty array of `errors`.
   * If the validation fails, the function returns an object with
   * `isValid` set to `false` and an
   * array of `errors` containing the validation errors.
   *
   * @param movements the bank movements to validate
   * @param checkpoints the balance checkpoints to validate against
   * @returns an object with `isValid` and `errors` properties
   */
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

  /**
   * Checks if there are any balance checkpoints.
   *
   * @param checkpoints the balance checkpoints to check
   * @returns a MissingCheckpointError if there are no balance checkpoints
   */
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

  /**
   * Checks if there are any bank movements.
   *
   * @param movements the bank movements to check
   * @returns a MissingMovementsError if there are no bank movements
   */
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

  /**
   * Checks if the final balance of the most recent checkpoint matches the
   * calculated balance of all movements.
   *
   * @param checkpoints the balance checkpoints to check
   * @param movements the bank movements to check
   * @returns a BalanceMismatchError if the final balance does not match the
   * calculated balance
   */
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

  /**
   * Checks if there are potential duplicate movements.
   *
   * It will consider a movement as a duplicate if it has the same date, amount and wording.
   *
   * @param movements the bank movements to check
   * @returns an array of PotentialMovementDuplicateError containing the IDs of the potential duplicate movements
   */
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

  /**
   * Removes a bank sync validation.
   *
   * @param id the id of the bank sync validation to remove
   * @returns a promise of the removed bank sync validation
   * @throws {NotFoundException} if the bank sync validation with the given id is not found
   */
  async remove(id: string) {
    const validation = await this.findOne(id);
    await this.bankSyncValidationRepository.remove(validation);
  }
}
