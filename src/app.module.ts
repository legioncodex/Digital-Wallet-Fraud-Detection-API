import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransferLimitsModule } from './transfer-limits/transfer-limits.module';
import { FraudFlagsModule } from './fraud-flags/fraud-flags.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(), // Add this to activate the clock!
    // 1. Tell NestJS how to connect to Redis
    BullModule.forRoot({
      connection: {
        host: 'localhost', // Or Redis URL from .env
        port: 6379,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Only for development!
    }),

    UsersModule,
    WalletsModule,
    TransactionsModule,
    TransferLimitsModule,
    FraudFlagsModule,
    AuditLogsModule,
    AuthModule,
  ],
})
export class AppModule {}
