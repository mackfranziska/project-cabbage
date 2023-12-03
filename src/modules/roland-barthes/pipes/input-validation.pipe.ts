import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AskHimDTO } from '../dto/ask-him.dto';

@Injectable()
export class InputValidationPipe implements PipeTransform {
  async transform(value: AskHimDTO) {
    const object = plainToClass(AskHimDTO, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException(
        `Validation failed: ${this.formatErrors(errors)}`,
      );
    }

    return value;
  }

  private formatErrors(errors: any[]): string {
    return errors
      .map((err) => Object.values(err.constraints).join(', '))
      .join(', ');
  }
}
