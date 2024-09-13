import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceCheckpoint } from '../balance-checkpoints/entities/balance-checkpoint.entity';
import { BankMovement } from '../bank-movements/entities/bank-movement.entity';
import { Repository } from 'typeorm';
import { BankSyncValidation } from './entities/bank-sync-validation.entity';
import {
  BalanceMismatchError,
  InconsistentDateError,
  MissingCheckpointError,
  MissingMovementsError,
  PotentialMovementDuplicateError,
  UnexpectedAmountError,
  ValidationError,
} from './models/validation-error';
import { PeriodsService } from '../periods/periods.service';
import { BankMovementsService } from '../bank-movements/bank-movements.service';
import { BalanceCheckpointsService } from '../balance-checkpoints/balance-checkpoints.service';
import { Period } from 'src/periods/entities/period.entity';

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
      order: { createdAt: 'DESC' },
    });
  }

  findAllByPeriodId(periodId: string): Promise<BankSyncValidation[]> {
    return this.bankSyncValidationRepository.find({
      where: { period: { id: periodId } },
      order: { createdAt: 'DESC' },
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
  validateMovementsAgainstCheckpoints(
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

    errors.push(...this.checkUnexpectedAmount(movements));

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Checks if there are any balance checkpoints.
   *
   * @param checkpoints the balance checkpoints to check
   * @returns a MissingCheckpointError if there are no balance checkpoints
   */
  checkMissingCheckpoints(
    checkpoints: BalanceCheckpoint[],
  ): MissingCheckpointError {
    if (checkpoints.length === 0) {
      return new MissingCheckpointError();
    }
  }

  /**
   * Checks if there are any bank movements.
   *
   * @param movements the bank movements to check
   * @returns a MissingMovementsError if there are no bank movements
   */
  checkMissingMovements(movements: BankMovement[]): MissingMovementsError {
    if (movements.length === 0) {
      return new MissingMovementsError();
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
  checkBalanceMismatch(
    checkpoints: BalanceCheckpoint[],
    movements: BankMovement[],
  ): BalanceMismatchError {
    if (checkpoints.length === 0 || movements.length === 0) {
      return;
    }
    // TODO: get most recent checkpoint balance
    const finalBalance = checkpoints[checkpoints.length - 1].balance;
    const calculatedBalance = movements.reduce(
      (acc, movement) => acc + movement.amount,
      0,
    );

    if (finalBalance !== calculatedBalance) {
      return new BalanceMismatchError(finalBalance, calculatedBalance);
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
  checkDuplicateMovements(
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
        const existingError = errors.find((error) =>
          error.movementIds.includes(movement.id),
        );

        if (!existingError) {
          errors.push(
            new PotentialMovementDuplicateError(seenMovements.get(key)!),
          );
        }
      } else {
        seenMovements.set(key, [movement.id]);
      }
    });
    return errors;
  }

  /**
   * Checks if there are movements with unexpected amounts.
   *
   * It will consider a movement as having an unexpected amount if the absolute value of the amount is greater than a given threshold.
   *
   * @param movements the bank movements to check
   * @returns an array of UnexpectedAmountError containing the IDs and amounts of the unexpected movements
   */
  checkUnexpectedAmount(movements: BankMovement[]): UnexpectedAmountError[] {
    const threshold = 10000; // Exemple de seuil pour les montants inattendus
    const errors: UnexpectedAmountError[] = [];
    movements.forEach((movement) => {
      if (Math.abs(movement.amount) > threshold) {
        errors.push(new UnexpectedAmountError(movement.id, movement.amount));
      }
    });
    return errors
  }

  /**
   * Checks if there are movements with dates outside the period.
   *
   * It will consider a movement as having an inconsistent date if the date is before the start date of the period or after the end date.
   *
   * @param periods the period to check against
   * @param movements the bank movements to check
   * @returns an array of InconsistentDateError containing the IDs and dates of the inconsistent movements
   */
  checkInconsistentDate(periods: Period, movements: BankMovement[]): InconsistentDateError[] {
    const errors: InconsistentDateError[] = [];
    movements.forEach((movement) => {
      if (movement.date < periods.startDate || movement.date > periods.endDate) {
          errors.push(new InconsistentDateError(movement.id, movement.date));
      }
    });
    return errors
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
