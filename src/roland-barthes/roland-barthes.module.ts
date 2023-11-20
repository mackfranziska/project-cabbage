import { Module } from '@nestjs/common';
import { RolandBarthesController } from './roland-barthes.controller';
import { RolandBarthesService } from './roland-barthes.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { port } from 'src/main';
import { S3Module } from '../s3/s3.module';

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
    S3Module,
  ],
  controllers: [RolandBarthesController],
  providers: [RolandBarthesService],
})
export class RolandBarthesModule {}
