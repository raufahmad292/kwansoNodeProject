// src/tasks/task.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { User } from 'src/users/user.entity';
import { invite } from 'src/users/invite.entity';
import { Task } from 'src/users/task.entity';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [JwtModule,TypeOrmModule.forFeature([User,invite, Task]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
