import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';


@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,

    @InjectQueue('notifications')
    private notificationsQueue: Queue,
  ) {}

  // 1. Create a new wallet for the user
  async createWallet(userId: string, currency: string = 'NGN') {
    // Optional check: Prevent the user from creating multiple wallets of the exact same currency
    const existingWallet = await this.walletsRepository.findOne({
      where: { user: { id: userId }, currency: currency },
    });

    if (existingWallet) {
      throw new ConflictException(`You already have a ${currency} wallet.`);
    }

    const newWallet = this.walletsRepository.create({
      currency,
      user: { id: userId }, // This magically links the wallet to the user via the foreign key
    });

    await this.walletsRepository.save(newWallet);
    return {
      message: `${currency} Wallet created successfully!`,
      walletId: newWallet.id,
    };
  }

  // 2. View balances
  async getUserWallets(userId: string) {
    return this.walletsRepository.find({
      where: { user: { id: userId } },
      select: {
        id: true,
        currency: true,
        balance: true,
        updatedAt: true,
      },
    });
  }

  async depositFunds(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException(
        'Deposit amount must be greater than zero.',
      );
    }

    // Find the user's primary NGN wallet
    const wallet = await this.walletsRepository.findOne({
      where: { user: { id: userId }, currency: 'NGN' },
    });

    if (!wallet) {
      throw new BadRequestException(
        'Wallet not found. Please create a wallet first.',
      );
    }

    // Add the funds (using Number to prevent string concatenation bugs)
    wallet.balance = Number(wallet.balance) + amount;
    await this.walletsRepository.save(wallet);

    // NEW: Push the job to the Redis queue in the background!
    // We name the job 'deposit-success' and pass the data payload.
    await this.notificationsQueue.add('deposit-success', {
      userId: userId,
      amount: amount,
      newBalance: wallet.balance,
      message: 'Your deposit was successful',
    });

    // The API responds instantly, without waiting for the email to actually send.
    return {
      message: 'Deposit successful!',
      newBalance: wallet.balance,
      walletId: wallet.id,
    };
  }
}
