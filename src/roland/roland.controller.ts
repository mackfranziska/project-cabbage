import { Body, Controller, Inject } from '@nestjs/common';
import { RolandService } from './roland.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AskRolandRequest, AskRolandResponse } from './models';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class RolandController {
  constructor(
    private readonly rolandService: RolandService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod('RolandService', 'AskRoland')
  askRoland(@Body() request: AskRolandRequest): AskRolandResponse {
    this.logger.info('you asked Roland:', request.input);
    return this.rolandService.askRoland(request);
  }
}
