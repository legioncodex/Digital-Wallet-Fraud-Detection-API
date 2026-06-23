import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Wallet } from '../wallets/entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { FraudFlagsService } from '../fraud-flags/fraud-flags.service';

@Injectable()
export class TransactionsService {
  // We inject the entire DataSource so we can manually control the database connection
  constructor(
    private dataSource: DataSource,
    private fraudService: FraudFlagsService, // Inject the security camera
  ) {}

  async transferFunds(
    senderUserId: string,
    receiverWalletId: string,
    amount: number,
  ) {
    // If this fails, it throws an error and stops the code right here.
    await this.fraudService.runSecurityChecks(senderUserId, amount);

    if (amount <= 0) {
      throw new BadRequestException(
        'Transfer amount must be greater than zero.',
      );
    }

    // 1. Create a dedicated database tunnel and start the "recording"
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. Fetch the Sender's Wallet and LOCK IT
      const senderWallet = await queryRunner.manager.findOne(Wallet, {
        where: { user: { id: senderUserId } },
        lock: { mode: 'pessimistic_write' },
        relations: { user: true }, // We need the user relation to match the ID
      });

      if (!senderWallet)
        throw new BadRequestException('Sender wallet not found.');
      if (senderWallet.id === receiverWalletId)
        throw new BadRequestException('Cannot transfer money to yourself.');
      if (Number(senderWallet.balance) < amount)
        throw new BadRequestException('Insufficient funds.');

      // 3. Fetch the Receiver's Wallet and LOCK IT
      const receiverWallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: receiverWalletId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!receiverWallet)
        throw new BadRequestException('Receiver wallet not found.');

      // 4. Safely Update Balances (Using Number() to avoid string concatenation bugs with decimals)
      senderWallet.balance = Number(senderWallet.balance) - amount;
      receiverWallet.balance = Number(receiverWallet.balance) + amount;

      await queryRunner.manager.save(senderWallet);
      await queryRunner.manager.save(receiverWallet);

      // 5. Create the immutable receipt in the Transactions ledger
      const transaction = queryRunner.manager.create(Transaction, {
        senderWallet,
        receiverWallet,
        amount,
        status: 'COMPLETED',
      });
      await queryRunner.manager.save(transaction);

      // 6. Everything worked! COMMIT the transaction permanently to the database
      await queryRunner.commitTransaction();

      return {
        message: 'Transfer successful!',
        transactionId: transaction.id,
        newBalance: senderWallet.balance,
      };
    } catch (error) {
      // 7. If ANY error happened above, UNDO EVERYTHING
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 8. Always release the tunnel back to the database, win or lose
      await queryRunner.release();
    }
  }

  async reverseTransaction(transactionId: string, adminUserId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find the original transaction
      const originalTx = await queryRunner.manager.findOne(Transaction, {
        where: { id: transactionId },
        relations: { senderWallet: true, receiverWallet: true }, // We need to know who sent/received it
      });

      if (!originalTx) throw new BadRequestException('Transaction not found.');
      if (originalTx.status === 'REVERSED')
        throw new BadRequestException('Transaction is already reversed.');
      if (originalTx.status !== 'COMPLETED')
        throw new BadRequestException(
          'Only completed transactions can be reversed.',
        );

      // 2. Lock the wallets to prevent race conditions during the reversal
      const senderWallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: originalTx.senderWallet.id },
        lock: { mode: 'pessimistic_write' },
      });

      const receiverWallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: originalTx.receiverWallet.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!senderWallet || !receiverWallet) {
        throw new Error('Sender or receiver wallet not found');
      }

      // 3. Safety Check: Does the receiver still have enough money to take back?
      if (Number(receiverWallet.balance) < Number(originalTx.amount)) {
        throw new BadRequestException(
          'Cannot reverse: Receiver has already spent the funds.',
        );
      }

      // 4. Reverse the math (Give money back to the sender, take it from the receiver)
      senderWallet.balance =
        Number(senderWallet.balance) + Number(originalTx.amount);
      receiverWallet.balance =
        Number(receiverWallet.balance) - Number(originalTx.amount);

      await queryRunner.manager.save(senderWallet);
      await queryRunner.manager.save(receiverWallet);

      // 5. Update the original transaction status
      originalTx.status = 'REVERSED';
      await queryRunner.manager.save(originalTx);

      // 6. Create the immutable Audit Log (For compliance)
      // Note: We use queryRunner.manager.query or create a raw object if AuditLog entity isn't imported
      await queryRunner.manager.insert('audit_logs', {
        action: 'REVERSED_TRANSACTION',
        targetTable: 'transactions',
        targetId: originalTx.id,
        details: { amount: originalTx.amount, reason: 'Admin reversal' },
        adminId: adminUserId,
      });

      // 7. Commit everything permanently
      await queryRunner.commitTransaction();

      return {
        message: 'Transaction successfully reversed.',
        transactionId: originalTx.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
