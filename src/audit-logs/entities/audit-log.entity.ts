import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string; // e.g., "REVERSED_TRANSACTION" or "INCREASED_TRANSFER_LIMIT"

  @Column()
  targetTable: string; // e.g., "transactions"

  @Column()
  targetId: string; // The ID of the item that was modified

  // jsonb is a special Postgres type that lets you save complex JavaScript objects directly
  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @ManyToOne(() => User, { nullable: true })
  admin: User;

  @CreateDateColumn()
  createdAt: Date;
}
