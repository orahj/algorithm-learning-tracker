import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('daily_logs')
export class DailyLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.dailyLogs, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'date' })
  date!: string;

  @Column()
  language!: string;

  @Column()
  topic!: string;

  @Column()
  problemName!: string;

  @Column()
  platform!: string;

  @Column()
  difficulty!: string;

  @Column()
  status!: string;

  @Column({ type: 'integer', default: 0 })
  timeSpent!: number;

  @Column({ type: 'text', default: '' })
  mistakeMade!: string;

  @Column({ type: 'text', default: '' })
  patternLearned!: string;

  @Column({ type: 'date', nullable: true })
  repeatDate?: string;

  @Column({ type: 'text', default: '' })
  notes!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
