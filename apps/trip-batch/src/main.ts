import { NestFactory } from '@nestjs/core';
import { TripBatchModule } from './trip-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(TripBatchModule);
  await app.listen(3000);
}
bootstrap();
