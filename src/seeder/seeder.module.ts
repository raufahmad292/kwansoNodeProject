// seeder.module.ts
import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { User } from '../users/user.entity'; // Import your TypeORM entities
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModules } from '../typeorm/typeorm.module'; // Import the TypeOrmModule

@Module({
  imports: [TypeOrmModules,TypeOrmModule.forFeature([User])], // Import any TypeORM entities you need
  providers: [SeederService],
})
export class SeederModule {}
