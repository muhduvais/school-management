import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('student')
export class StudentController {

  @Get('test')
  @UseGuards(JwtAuthGuard)
  test() {
    return { message: 'Protected route working' };
  }
}
