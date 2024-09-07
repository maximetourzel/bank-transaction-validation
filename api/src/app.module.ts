import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankMovementsModule } from './bank-movements/bank-movements.module';
import { BalanceCheckpointsModule } from './balance-checkpoints/balance-checkpoints.module';
import { BankSyncValidationsModule } from './bank-sync-validations/bank-sync-validations.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { PeriodsModule } from './periods/periods.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
    }),
    BankMovementsModule,
    BalanceCheckpointsModule,
    BankSyncValidationsModule,
    PeriodsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
