import { Body, Controller, Inject } from '@nestjs/common';
import { RolandBarthesService } from '../services/roland-barthes.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AskHimRequest, AskHimResponse } from '../models/roland-barthes.models';
import { GrpcMethod } from '@nestjs/microservices';
import { S3Service } from '../services/s3.service';
import { createDiscourse } from '../utils/create-discourse.util';

@Controller()
export class RolandBarthesController {
  constructor(
    private readonly rolandService: RolandBarthesService,
    private readonly s3Service: S3Service,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('RolandBarthesService', 'AskHim')
  askHim(@Body() request: AskHimRequest): AskHimResponse {
    try {
      const response = this.rolandService.askRoland(request);
      this.s3Service.saveToS3(createDiscourse(request, response));

      return response;
    } catch (error) {
      this.logger.error('Error processing AskHim request:', error);
      throw error;
    }
  }
}
