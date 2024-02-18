import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './seeder/seeder.module';
import { InvitationModule } from './invitation/invitation.module';
import { TaskModule } from './tasks/task.module';
import { TypeOrmModules } from './typeorm/typeorm.module'; // Import the TypeOrmModule


@Module({
  imports: [TypeOrmModules,AuthModule,SeederModule,InvitationModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
