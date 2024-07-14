import { Controller, Get } from '@nestjs/common';
import { TripBatchService } from './trip-batch.service';

@Controller()
export class TripBatchController {
  constructor(private readonly tripBatchService: TripBatchService) {}

  @Get()
  getHello(): string {
    return this.tripBatchService.getHello();
  }
}
