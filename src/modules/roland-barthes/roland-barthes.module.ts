import { Module } from '@nestjs/common';
import { RolandBarthesController } from './controllers/roland-barthes.controller';
import { RolandBarthesService } from './services/roland-barthes.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { port } from 'src/main';
import { S3Service } from '../../shared/aws/s3.service';
import { AwsConfigService } from '../../shared/aws/aws-config.service';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.simple(),
      transports: [new winston.transports.Console()],
    }),
    ClientsModule.register([
      {
        name: 'ROLAND_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: `localhost:${port}`,
          package: 'roland',
          protoPath: './roland.proto',
        },
      },
    ]),
  ],
  controllers: [RolandBarthesController],
  providers: [RolandBarthesService, S3Service, AwsConfigService],
})
export class RolandBarthesModule {}
