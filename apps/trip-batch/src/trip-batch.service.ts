import { Injectable } from '@nestjs/common';

@Injectable()
export class TripBatchService {
  getHello(): string {
    return 'Welcome to Trip Batch Server!';
  }
}
