import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getRoot() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Nest JS Monolith',
    }
  }
}
