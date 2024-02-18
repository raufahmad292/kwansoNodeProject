// src/tasks/task.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export enum TaskStatus {
    Pending = 'Pending',
    Completed = 'Completed',
  }

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: TaskStatus.Pending })
  status: TaskStatus;
  
  @Column()
  user_id: number;
}
