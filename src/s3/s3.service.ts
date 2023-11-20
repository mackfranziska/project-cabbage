import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Discourse } from 'src/models';
import { Logger } from 'winston';
// import { AwsConfigService } from './aws.config.service';

@Injectable()
export class S3Service {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    // private readonly awsConfigService: AwsConfigService
  ) {}

  async saveDiscourseToS3(data: Discourse): Promise<void> {
    const bucket = 'requests';
    const key = 'discourse.txt';

    await this.saveToS3(bucket, key, data);
  }

  private async saveToS3(
    bucket: string,
    key: string,
    data: Discourse,
  ): Promise<void> {
    this.logger.info(`path: ${bucket}/${key}, data: ${JSON.stringify(data)}`);

    //   const s3 = this.awsConfigService.getS3();
    //   await s3
    //     .putObject({
    //       Bucket: bucket,
    //       Key: key,
    //       Body: JSON.stringify(data),
    //     })
    //     .promise();
  }
}
