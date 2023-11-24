import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();
const serviceName = 'nest-grpc-server';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_URL,
      package: process.env.GRPC_PACKAGE,
      protoPath: process.env.GRPC_PROTO_PATH,
    },
  });
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  await app.listen();

  logger.info(
    `Started '${serviceName}', listening on port ${process.env.PORT}...`,
  );
}
bootstrap();
