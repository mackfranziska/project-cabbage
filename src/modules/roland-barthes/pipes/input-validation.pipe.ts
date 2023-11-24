import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { AskHimRequest } from '../models/roland-barthes.models';

@Injectable()
export class InputValidationPipe implements PipeTransform {
  async transform(request: AskHimRequest) {
    if (isValidInput(request.input) && isValidInput(request.name)) {
      return request;
    } else {
      throw new BadRequestException('Invalid request');
    }
  }
}

const isValidInput = (input: string): boolean => {
  const validCharsRegex = /^[a-zA-Z0-9,.!?'" ]*$/;
  return validCharsRegex.test(input);
};
