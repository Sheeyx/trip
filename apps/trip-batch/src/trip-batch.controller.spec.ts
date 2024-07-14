import { Test, TestingModule } from '@nestjs/testing';
import { TripBatchController } from './trip-batch.controller';
import { TripBatchService } from './trip-batch.service';

describe('TripBatchController', () => {
  let tripBatchController: TripBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TripBatchController],
      providers: [TripBatchService],
    }).compile();

    tripBatchController = app.get<TripBatchController>(TripBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tripBatchController.getHello()).toBe('Hello World!');
    });
  });
});
