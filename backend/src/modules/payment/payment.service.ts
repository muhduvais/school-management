import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(studentId: string, amount: number) {
    return this.paymentModel.create({
      student: studentId,
      amount,
    });
  }

  async findAll() {
    return this.paymentModel.find().populate('student');
  }

  async markPaid(id: string) {
    const payment = await this.paymentModel.findById(id);

    if (!payment) throw new NotFoundException('Payment not found');

    payment.isPaid = true;
    payment.paidAt = new Date();

    return payment.save();
  }
}