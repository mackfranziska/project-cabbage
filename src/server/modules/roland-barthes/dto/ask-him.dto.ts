import { IsString, IsNotEmpty } from 'class-validator';

export class AskHimDTO {
  @IsString()
  @IsNotEmpty()
  input: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
