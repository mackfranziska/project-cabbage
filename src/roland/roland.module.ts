import { Module } from '@nestjs/common';
import { RolandController } from './roland.controller';
import { RolandService } from './roland.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { port } from 'src/main';

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
  controllers: [RolandController],
  providers: [RolandService],
})
export class RolandModule {}
