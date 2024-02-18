
// seeder.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
   
    const existingAdmin = await this.userRepository.findOne({ where: { role: 1 } });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    // Create admin user
    const adminUser = new User();
    adminUser.username = 'admin';
    adminUser.role =1
    const salt = await bcrypt.genSalt();
    adminUser.password = await bcrypt.hash('adminpassword', salt); // You should replace 'adminpassword' with a secure password
    await this.userRepository.save(adminUser);

  }
}
