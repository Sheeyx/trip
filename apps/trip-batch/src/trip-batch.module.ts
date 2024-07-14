import { Module } from '@nestjs/common';
import { TripBatchController } from './trip-batch.controller';
import { TripBatchService } from './trip-batch.service';

@Module({
  imports: [],
  controllers: [TripBatchController],
  providers: [TripBatchService],
})
export class TripBatchModule {}
