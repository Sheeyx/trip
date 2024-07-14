import { Module } from '@nestjs/common';
import { TripBatchController } from './trip-batch.controller';
import { TripBatchService } from './trip-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [TripBatchController],
  providers: [TripBatchService],
})
export class TripBatchModule {}
