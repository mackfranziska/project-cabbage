import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    console.log('Accessing the root route');
    return 'Hello, World!';
  }
}
