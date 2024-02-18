// src/invitations/invitation.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { User } from 'src/users/user.entity';
import { invite } from 'src/users/invite.entity';
import { Task } from 'src/users/task.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [JwtModule,TypeOrmModule.forFeature([User,invite,Task])],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
