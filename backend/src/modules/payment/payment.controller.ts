import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() body: { studentId: string; amount: number }) {
    return this.paymentService.create(body.studentId, body.amount);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Patch(':id/pay')
  markPaid(@Param('id') id: string) {
    return this.paymentService.markPaid(id);
  }
}