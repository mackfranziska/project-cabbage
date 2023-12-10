import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
} from '@nestjs/common';
import { RolandBarthesService } from './roland-barthes.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AskHimDTO } from './dto/ask-him.dto';
import { S3Service } from '../../shared/services/s3.service';
import { createDiscourse } from './utils/create-discourse.util';
import { ROLAND_ROUTE_NAME, REQUESTS_DIR } from '../../shared/constants';
import { InputValidationPipe } from './pipes/input-validation.pipe';

@Controller(ROLAND_ROUTE_NAME)
export class RolandBarthesController {
  constructor(
    private readonly rolandService: RolandBarthesService,
    private readonly s3Service: S3Service,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('ask')
  @UsePipes(new InputValidationPipe())
  async askRoland(@Body() data: AskHimDTO): Promise<void> {
    try {
      const response = await this.rolandService.askHim(data);

      this.logger.info('Roland has processed your request successfully!');
      this.logger.info(response.output);

      if (process.env.NODE_ENV === 'production') {
        const discourse = createDiscourse(data, response);
        const filePath = `${REQUESTS_DIR}/${Date.now()}.json`;

        await this.s3Service.uploadFile(discourse, filePath);
      } else {
        this.logger.info(`Saving discourse to s3`);
      }

      return Promise.resolve();
    } catch (error) {
      this.logger.error(
        'Roland could not process your request:',
        error.message,
      );
      throw new BadRequestException('Roland can not answer right now.');
    }
  }
}
