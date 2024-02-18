import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../seeder/seeder.module';
import { SeederService } from '../seeder/seeder.service';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seeder = app.get(SeederService);
  await seeder.seed();
  await app.close();
}

runSeed();
