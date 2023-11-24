import { Controller, Inject, UsePipes } from '@nestjs/common';
import { RolandBarthesService } from '../services/roland-barthes.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AskHimRequest, AskHimResponse } from '../models/roland-barthes.models';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { S3Service } from '../../../shared/s3/s3.service';
import { createDiscourse } from '../utils/create-discourse.util';
import { REQUESTS_DIR } from '../../../shared/constants';
import { InputValidationPipe } from '../pipes/input-validation.pipe';

@Controller()
export class RolandBarthesController {
  constructor(
    private readonly rolandService: RolandBarthesService,
    private readonly s3Service: S3Service,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('RolandBarthesService', 'AskHim')
  @UsePipes(new InputValidationPipe())
  askRoland(@Payload() request: AskHimRequest): AskHimResponse {
    const response = this.rolandService.askHim(request);

    this.logger.info('Roland says:', response);

    const discourse = createDiscourse(request, response);
    const filePath = `${REQUESTS_DIR}/${Date.now()}.json`;
    this.s3Service.uploadFile(discourse, filePath);

    return response;
  }
}
