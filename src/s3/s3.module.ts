import { Module } from '@nestjs/common';
import { S3Controller } from 'src/s3/s3.controller';
import { S3Service } from './s3.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.simple(),
      transports: [new winston.transports.Console()],
    }),
  ],
  providers: [S3Service, S3Controller],
  exports: [S3Service, S3Controller],
})
export class S3Module {}
