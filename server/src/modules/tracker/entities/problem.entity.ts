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

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.problems, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  name!: string;

  @Column()
  topic!: string;

  @Column()
  language!: string;

  @Column()
  difficulty!: string;

  @Column({ type: 'text', default: '' })
  link!: string;

  @Column()
  status!: string;

  @Column({ type: 'date', nullable: true })
  lastAttemptedDate?: string;

  @Column({ type: 'date', nullable: true })
  repeatDate?: string;

  @Column({ type: 'text', default: '' })
  notes!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
