// src/typeorm/typeorm.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { invite } from '../users/invite.entity';
import { Task } from '../users/task.entity'

@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({
        useFactory: () => ({
            type: 'mariadb', // e.g., 'mysql', 'postgres', 'mongodb', etc.
            host: 'localhost',
            port: 3306, // e.g., 5432 for PostgreSQL, 3306 for MySQL
            username: 'root',
            password: '',
            database: 'kwanso',
            entities: [User,invite,Task], // Add any other entities here if necessary
            synchronize: true, // Set to true for development, but false in production
          }),
    }),
  ],
  exports: [NestTypeOrmModule],
})
export class TypeOrmModules {}
