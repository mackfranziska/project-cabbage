import { Body, Injectable } from '@nestjs/common';
import { AskHimRequest, AskHimResponse } from './models';

@Injectable()
export class RolandBarthesService {
  askHim(@Body() request: AskHimRequest): AskHimResponse {
    const { input, name } = request;
    const rolandsInterpretation = `~${input}~`;
    return {
      output: `What you mean to say, ${name}, is: ${rolandsInterpretation}!`,
    };
  }
}
