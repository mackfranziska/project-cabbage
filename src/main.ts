import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as dotenv from 'dotenv';

dotenv.config();
const httpsServiceName = 'nest-http-server';

async function bootstrap() {
  const hostName =
    process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

  const app = await NestFactory.create(AppModule);
  await app.listen(8080, hostName);

  const logger = app.get(WINSTON_MODULE_PROVIDER);
  logger.info(`Started '${httpsServiceName}' at: ${await app.getUrl()}`);
}

bootstrap();
