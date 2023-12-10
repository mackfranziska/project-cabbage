import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { RolandBarthesModule } from './modules/roland-barthes/roland-barthes.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.simple(),
      transports: [new winston.transports.Console()],
    }),
    RolandBarthesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
