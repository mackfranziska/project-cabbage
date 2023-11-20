import { Controller, Post, Body, Inject } from '@nestjs/common';
import { S3Service } from './s3.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Discourse } from 'src/models';

@Controller('s3')
export class S3Controller {
  constructor(
    private readonly s3Service: S3Service,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('saveDiscourse')
  async saveDiscourse(@Body() data: Discourse): Promise<void> {
    this.logger.info('Saving discourse to S3...');
    await this.s3Service.saveDiscourseToS3(data);
  }
}
