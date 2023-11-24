import { Module } from '@nestjs/common';
import { RolandBarthesController } from './controllers/roland-barthes.controller';
import { RolandBarthesService } from './services/roland-barthes.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { S3Service } from '../../shared/aws/s3.service';
import { AwsConfigService } from '../../shared/aws/aws-config.service';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.simple(),
      transports: [new winston.transports.Console()],
    }),
  ],
  controllers: [RolandBarthesController],
  providers: [RolandBarthesService, S3Service, AwsConfigService],
})
export class RolandBarthesModule {}
