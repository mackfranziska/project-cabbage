import { Body, Injectable } from '@nestjs/common';
import { AskRolandRequest, AskRolandResponse } from './models';

@Injectable()
export class RolandService {
  askRoland(@Body() request: AskRolandRequest): AskRolandResponse {
    const { input, name } = request;
    const rolandsInterpretation = `~${input}~`;
    return {
      output: `What ${name} actually means is: ${rolandsInterpretation}!`,
    };
  }
}
