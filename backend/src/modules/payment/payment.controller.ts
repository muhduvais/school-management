import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Types } from 'mongoose';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() body: { studentId: string; amount: number }) {
    return this.paymentService.create(body.studentId, body.amount);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.paymentService.findByStudent(studentId);
  }

  @Get('summary/:studentId')
  async getSummary(@Param('studentId') studentId: string) {
    if (!Types.ObjectId.isValid(studentId)) {
      throw new BadRequestException('Invalid student ID');
    }

    const summary = await this.paymentService.getStudentSummary(studentId);

    return {
      message: 'Student payment summary fetched successfully',
      data: summary,
    };
  }
}
