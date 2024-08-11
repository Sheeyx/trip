import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK } from './libs/config';

@Controller()
export class BatchController {
  constructor(private readonly batchService: BatchService) {}
  private logger: Logger = new Logger("BatchController");

  @Timeout(1000)
  handleTimeout() {
    this.logger.debug("BATCH SERVER READY!")
  }

  @Cron("00 * * * * *", {name: BATCH_ROLLBACK})
  public async batchRollback() {
    try {
      this.logger["context"] = BATCH_ROLLBACK;
      this.logger.debug("EXECUTED");
      await this.batchService.batchRollback();
    } catch (err) {
      this.logger.error(err)
    }
  }

  @Cron("20 * * * * *", {name: "CRON_TEST"})
  public async batchProperties() {
    try {
      this.logger["context"] = "CRON_TEST";
      this.logger.debug("EXECUTED");
      await this.batchService.batchProperties();
    } catch (err) {
      this.logger.error(err)
    }
  }

  @Cron("40 * * * * *", {name: "CRON_TEST"})
  public async batchAgents () {
    try {
      this.logger["context"] = "CRON_TEST";
      this.logger.debug("EXECUTED");
      await this.batchService.batchAgents();
    } catch (err) {
      this.logger.error(err)
    } 
  }

  /*
  @Interval(1000)
  handleInterval() {
    this.logger.debug("INTERVAL TEST")
  }
  */


  @Get()
  getHello(): string {
    return this.batchService.getHello();
  }
}