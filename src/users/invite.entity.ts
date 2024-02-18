// src/invitations/invitation.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'invite' })
export class invite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  expiresAt: Date;
}
