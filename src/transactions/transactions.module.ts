import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { FraudFlagsModule } from '../fraud-flags/fraud-flags.module';

@Module({
  // Added FraudFlagsModule here
  imports: [TypeOrmModule.forFeature([Transaction, Wallet]), FraudFlagsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
