import _ from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AwsConfigService } from '../config/aws-config.service';
import {
  GetObjectCommand,
  ListObjectsCommand,
  // PutObjectCommand,
  // PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Response } from 'node-fetch';
import { Readable } from 'stream';
import { BUCKET_NAME } from '../constants';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly awsConfigService: AwsConfigService,
  ) {
    this.s3 = {} as S3Client; // this.awsConfigService.getS3();
  }

  async uploadFile(data: object, filePath: string): Promise<void> {
    // const bufferData = Buffer.from(JSON.stringify(data));

    // const putObjectCommand = new PutObjectCommand({
    //   Bucket: BUCKET_NAME,
    //   Body: bufferData,
    //   Key: filePath,
    // });

    this.logger.info(
      `path: ${BUCKET_NAME}/${filePath}, data: ${JSON.stringify(data)}`,
    );

    // return this.s3.send(putObjectCommand);
  }

  async getJSON(key: string): Promise<object> {
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const s3Response = await this.s3.send(getObjectCommand);
    const response = new Response(s3Response.Body as Readable);
    return response.json();
  }

  async getAllFilesInFolder(folderPath: string): Promise<object[]> {
    const filesPaths: string[] = await this.listFilesInFolder(folderPath);
    return this.getFilesByKey(filesPaths);
  }

  private async listFilesInFolder(folderPath: string): Promise<string[]> {
    const listObjectsCommand = new ListObjectsCommand({
      Bucket: BUCKET_NAME,
      Delimiter: '/',
      Prefix: `${folderPath}/`,
    });
    const result = await this.s3.send(listObjectsCommand);
    return _.map(result.Contents, (content) => content.Key);
  }

  private getFilesByKey(keys: string[]): Promise<object[]> {
    return Promise.all(keys.map((key) => this.getJSON(key)));
  }
}
