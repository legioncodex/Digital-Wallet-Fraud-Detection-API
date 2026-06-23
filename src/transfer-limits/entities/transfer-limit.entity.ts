import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('transfer_limits')
export class TransferLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 10000.0 }) // E.g., 10,000 max per day
  dailyLimit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  currentUsage: number;

  @UpdateDateColumn()
  lastResetDate: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
