import { Body, Controller, Inject } from '@nestjs/common';
import { RolandBarthesService } from './roland-barthes.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AskHimRequest, AskHimResponse } from './models';
import { GrpcMethod } from '@nestjs/microservices';
import { S3Controller } from '../s3/s3.controller';
import { Discourse } from 'src/models';

@Controller()
export class RolandBarthesController {
  constructor(
    private readonly rolandService: RolandBarthesService,
    private readonly s3Controller: S3Controller,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('RolandBarthesService', 'AskHim')
  askHim(@Body() request: AskHimRequest): AskHimResponse {
    try {
      const response = this.rolandService.askHim(request);

      const discourse: Discourse = {
        name: request.name,
        input: request.input,
        output: response.output,
      };
      this.s3Controller.saveDiscourse(discourse);

      return response;
    } catch (error) {
      this.logger.error('Error processing AskHim request:', error);
      throw error;
    }
  }
}
