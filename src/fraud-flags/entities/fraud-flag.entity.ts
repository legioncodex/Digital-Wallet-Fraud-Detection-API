import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { User } from '../../users/entities/user.entity';

@Entity('fraud_flags')
export class FraudFlag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reason: string; // e.g., "Transfer amount is unusually high"

  @Column({ default: 'OPEN' }) // OPEN, INVESTIGATING, RESOLVED
  status: string;

  @ManyToOne(() => Transaction)
  transaction: Transaction;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
