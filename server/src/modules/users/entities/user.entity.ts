import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { DailyLog } from '../../tracker/entities/daily-log.entity';
import { Problem } from '../../tracker/entities/problem.entity';
import { TopicNote } from '../../tracker/entities/topic-note.entity';

export enum AuthProvider {
  Local = 'local',
  Google = 'google'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  displayName!: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ type: 'text', default: AuthProvider.Local })
  provider!: AuthProvider;

  @Column({ nullable: true })
  providerId?: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => DailyLog, (dailyLog) => dailyLog.user)
  dailyLogs!: DailyLog[];

  @OneToMany(() => Problem, (problem) => problem.user)
  problems!: Problem[];

  @OneToMany(() => TopicNote, (note) => note.user)
  notes!: TopicNote[];
}
