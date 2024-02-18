import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { invite } from 'src/users/invite.entity';
import { Task } from 'src/users/task.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[JwtModule, TypeOrmModule.forFeature([User,invite, Task])]
  
})
export class AuthModule {}
