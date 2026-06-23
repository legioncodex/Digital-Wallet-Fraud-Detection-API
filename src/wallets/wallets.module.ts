import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet } from './entities/wallet.entity';
import { NotificationsProcessor } from './notifications.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  // Registering the Wallet table here
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    
    // 2. Register a specific channel called 'notifications'
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],

  controllers: [WalletsController],
  providers: [WalletsService, NotificationsProcessor],
})
export class WalletsModule {}
