import { Body, Inject, Injectable } from '@nestjs/common';
import { AskHimRequest, AskHimResponse } from '../models/roland-barthes.models';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class RolandBarthesService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  askHim(@Body() request: AskHimRequest): AskHimResponse {
    const { input, name } = request;

    // TODO: process input
    const rolandsInterpretation = `~${input}~`;

    return {
      output: `What you mean to say, ${name}, is: ${rolandsInterpretation}!`,
    };
  }
}
