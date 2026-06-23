import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // NEW: Added currency so we know what kind of money this wallet holds (e.g., 'NGN', 'USD')
  @Column({ type: 'varchar', default: 'NGN' })
  currency: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  balance: number;

  // UPDATED: Many wallets can belong to ONE user.
  // { onDelete: 'CASCADE' } means if a user account is deleted, their wallets are deleted automatically.
  @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
