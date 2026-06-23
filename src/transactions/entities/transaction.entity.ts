import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'PENDING' }) // Can be PENDING, COMPLETED, FAILED, REVERSED
  status: string;

  // Many transactions can belong to one sender wallet
  @ManyToOne(() => Wallet)
  senderWallet: Wallet;

  // Many transactions can belong to one receiver wallet
  @ManyToOne(() => Wallet)
  receiverWallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;
}
