import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Transport } from '@nestjs/microservices';

const serviceName = 'nest-grpc';
export const port = 5000;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `localhost:${5000}`,
      package: 'roland',
      protoPath: './roland.proto',
    },
  });
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  await app.listen();

  logger.info(`Started '${serviceName}', listening on port ${port}...`);
}
bootstrap();
