import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { Period } from '../src/periods/entities/period.entity';
import { BankMovement } from '../src/bank-movements/entities/bank-movement.entity';
import { BalanceCheckpoint } from 'src/balance-checkpoints/entities/balance-checkpoint.entity';
import { BankSyncValidation } from 'src/bank-sync-validations/entities/bank-sync-validation.entity';
import { v4 as uuidv4 } from 'uuid';

describe('All Tests e2e', () => {
  let app: INestApplication;
  let periodRepository: Repository<Period>;
  let bankMovementRepository: Repository<BankMovement>;
  let checkpointRepository: Repository<BalanceCheckpoint>;
  let validationRepository: Repository<BankSyncValidation>;
  let periodSaved: Period;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const dataSource = app.get(DataSource);
    await dataSource.synchronize(true);

    periodRepository = dataSource.getRepository(Period);
    bankMovementRepository = dataSource.getRepository(BankMovement);
    checkpointRepository = dataSource.getRepository(BalanceCheckpoint);
    validationRepository = dataSource.getRepository(BankSyncValidation);

    const period = periodRepository.create({
      year: 2020,
      month: 'janvier',
    });
    periodSaved = await periodRepository.save(period);
  });
  afterAll(async () => {
    await app.close();
  }, 30000);

  describe('AppController (e2e)', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('PeriodsController (e2e)', () => {
    describe('POST /periods', () => {
      const createPeriodDto = {
        year: 2023,
        month: 'janvier',
      };
      it('should create a new period', () => {
        return request(app.getHttpServer())
          .post('/periods')
          .send(createPeriodDto)
          .expect(201)
          .expect((response: request.Response) => {
            const { id, year, month, startDate, endDate } = response.body;

            expect(typeof id).toBe('string');
            expect(typeof year).toBe('number');
            expect(typeof month).toBe('string');
            expect(typeof startDate).toBe('string');
            expect(typeof endDate).toBe('string');

            expect(year).toBe(createPeriodDto.year);
            expect(month).toBe(createPeriodDto.month);
            expect(startDate).toBeDefined();
            expect(endDate).toBeDefined();
          });
      });

      it('should throw an error if the period already exists', () => {
        return request(app.getHttpServer())
          .post('/periods')
          .send(createPeriodDto)
          .expect(409)
          .expect((response: request.Response) => {
            expect(response.body.message).toBe('Period already exists');
          });
      });
    });
    describe('GET /periods', () => {
      it('should return an array of periods', () => {
        return request(app.getHttpServer())
          .get('/periods')
          .expect(200)
          .expect((response: request.Response) => {
            expect(response.body).toBeInstanceOf(Array);
          });
      });
    });
    describe('GET /periods/:id', () => {
      it('should return the period with the given id', () => {
        return request(app.getHttpServer())
          .get(`/periods/${periodSaved.id}`)
          .expect(200)
          .expect((response: request.Response) => {
            const { id, year, month, startDate, endDate } = response.body;

            expect(id).toBe(periodSaved.id);
            expect(year).toBe(periodSaved.year);
            expect(month).toBe(periodSaved.month);
            expect(startDate).toBeDefined();
            expect(endDate).toBeDefined();
            expect(typeof id).toBe('string');
            expect(typeof year).toBe('number');
            expect(typeof month).toBe('string');
            expect(typeof startDate).toBe('string');
            expect(typeof endDate).toBe('string');
          });
      });
    });
    describe('DELETE /periods/:id', () => {
      let periodToDeleteSaved: Period;
      beforeAll(async () => {
        const periodToDelete = periodRepository.create({
          year: 2020,
          month: 'mars',
        });
        periodToDeleteSaved = await periodRepository.save(periodToDelete);
      });
      it('should delete the period with the given id', async () => {
        return request(app.getHttpServer())
          .delete(`/periods/${periodToDeleteSaved.id}`)
          .expect(204);
      });
    });
  });

  describe('BankMovementsController (e2e)', () => {
    describe('POST /bank-movements', () => {
      const createBankMovementDto = {
        date: '2020-01-15',
        amount: 100,
        wording: 'Depot test',
      };

      it('should create a new bank movement', () => {
        return request(app.getHttpServer())
          .post(`/periods/${periodSaved.id}/movements`)
          .send(createBankMovementDto)
          .expect(201)
          .expect((response: request.Response) => {
            const { id, date, amount, wording } = response.body;
            expect(typeof id).toBe('string');
            expect(typeof date).toBe('string');
            expect(typeof amount).toBe('number');
            expect(typeof wording).toBe('string');

            expect(amount).toBe(createBankMovementDto.amount);
            expect(wording).toBe(createBankMovementDto.wording);
          });
      });
    });
    describe('GET /periods/:periodId/movements', () => {
      it('should return an array of bank movements for a given period', async () => {
        const movement = bankMovementRepository.create({
          date: '2020-01-15',
          amount: 100,
          wording: 'Depot test',
          period: periodSaved,
        });
        await bankMovementRepository.save(movement);

        return request(app.getHttpServer())
          .get(`/periods/${periodSaved.id}/movements`)
          .expect(200)
          .expect((response: request.Response) => {
            expect(Array.isArray(response.body)).toBe(true);
          });
      });
    });

    describe('DELETE /movements/:id', () => {
      it('should delete a bank movement', async () => {
        const movement = bankMovementRepository.create({
          date: '2020-01-15',
          amount: 100,
          wording: 'Depot test',
          period: periodSaved,
        });
        const movementSaved = await bankMovementRepository.save(movement);

        return request(app.getHttpServer())
          .delete(`/movements/${movementSaved.id}`)
          .expect(204);
      });
    });
  });

  describe('BalanceCheckerController (e2e)', () => {
    describe('POST /periods/:periodId/checkpoints', () => {
      it('should create a new balance checkpoint', async () => {
        const createBalanceCheckpointDto = {
          date: '2022-01-15',
          balance: 1000,
        };

        const response = await request(app.getHttpServer())
          .post(`/periods/${periodSaved.id}/checkpoints`)
          .send(createBalanceCheckpointDto)
          .expect(201)
          .expect((response: request.Response) => {
            const { id, date, balance } = response.body;
            expect(typeof id).toBe('string');
            expect(typeof date).toBe('string');
            expect(typeof balance).toBe('number');

            expect(balance).toBe(createBalanceCheckpointDto.balance);
            expect(date).toBe(createBalanceCheckpointDto.date);
          });

        expect(response.body).toHaveProperty('id');
      });
    });

    describe('GET /periods/:periodId/checkpoints', () => {
      it('should retrieve all balance checkpoints for a period', async () => {
        const checkpoint = checkpointRepository.create({
          date: '2020-01-15',
          balance: 1000,
          period: periodSaved,
        });
        await checkpointRepository.save(checkpoint);

        const response = await request(app.getHttpServer())
          .get(`/periods/${periodSaved.id}/checkpoints`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('GET /checkpoints/:id', () => {
      it('should retrieve a balance checkpoint by id', async () => {
        const checkpoint = checkpointRepository.create({
          date: '2020-01-15',
          balance: 1000,
          period: periodSaved,
        });
        await checkpointRepository.save(checkpoint);
        const response = await request(app.getHttpServer())
          .get(`/checkpoints/${checkpoint.id}`)
          .expect(200);

        expect(response.body).toHaveProperty('id', checkpoint.id);
      });
    });

    describe('PATCH /checkpoints/:id', () => {
      it('should update a balance checkpoint', async () => {
        const checkpoint = checkpointRepository.create({
          date: '2022-01-15',
          balance: 1000,
          period: periodSaved,
        });
        await checkpointRepository.save(checkpoint);
        const updateBalanceCheckpointDto = {
          balance: 2000,
        };

        const response = await request(app.getHttpServer())
          .patch(`/checkpoints/${checkpoint.id}`)
          .send(updateBalanceCheckpointDto)
          .expect(200);

        expect(response.body).toHaveProperty('balance', 2000);
      });
    });

    describe('DELETE /checkpoints/:id', () => {
      it('should delete a balance checkpoint', async () => {
        const checkpoint = checkpointRepository.create({
          date: '2022-01-15',
          balance: 1000,
          period: periodSaved,
        });
        await checkpointRepository.save(checkpoint);
        await request(app.getHttpServer())
          .delete(`/checkpoints/${checkpoint.id}`)
          .expect(204);
      });
    });
  });

  describe('ValidationsController (e2e)', () => {
    describe('POST /periods/:periodId/validations', () => {
      it('should create a new validation', async () => {
        return request(app.getHttpServer())
          .post(`/periods/${periodSaved.id}/validations`)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('isValid');
            expect(res.body).toHaveProperty('movements');
            expect(res.body.movements).toBeInstanceOf(Array);
            expect(res.body).toHaveProperty('checkpoints');
            expect(res.body.checkpoints).toBeInstanceOf(Array);
          });
      });
    });
    describe('GET /periods/:periodId/validations', () => {
      it('should return a validation by period id', async () => {
        return request(app.getHttpServer())
          .get(`/periods/${periodSaved.id}/validations`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('isValid');
          });
      });

      it('should return 404 if the validation is not found', async () => {
        const wrongPeriodId = uuidv4();
        return request(app.getHttpServer())
          .get(`/periods/${wrongPeriodId}/validations`)
          .expect(404);
      });
    });
    describe('GET /validations/:validationId', () => {
      it('should return a validation by its id', async () => {
        const validationId = uuidv4();

        const validation = validationRepository.create({
          id: validationId,
          period: { id: periodSaved.id } as any,
          isValid: true,
          validationErrors: [],
          movements: [],
          checkpoints: [],
          previousValidation: null,
        });
        await validationRepository.save(validation);

        return request(app.getHttpServer())
          .get(`/validations/${validationId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id', validationId);
            expect(res.body).toHaveProperty('isValid', true);
          });
      });

      it('should return 404 if the validation is not found', async () => {
        const wrongValidationId = uuidv4();

        return request(app.getHttpServer())
          .get(`/validations/${wrongValidationId}`)
          .expect(404);
      });
    });
  });

  describe('DELETE /validations/:validationId', () => {
    it('should delete a validation by its id', async () => {
      const validationId = uuidv4();

      const validation = validationRepository.create({
        id: validationId,
        period: { id: periodSaved.id } as any,
        isValid: true,
        validationErrors: [],
        movements: [],
        checkpoints: [],
        previousValidation: null,
      });
      await validationRepository.save(validation);

      return request(app.getHttpServer())
        .delete(`/validations/${validationId}`)
        .expect(204);
    });

    it('should return 404 if the validation to delete is not found', async () => {
      return request(app.getHttpServer())
        .delete(`/validations/${uuidv4()}`)
        .expect(404);
    });
  });
});
