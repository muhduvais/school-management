import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';
import { BASE_FEE } from '../../common/constants/fees';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(studentId: string, amount: number) {
    return await this.paymentModel.create({
      student: studentId,
      amount,
    });
  }

  async findByStudent(studentId: string) {
    return this.paymentModel.find({ student: studentId });
  }

  async getStudentSummary(studentId: string) {
    const payments = await this.paymentModel.find({ student: studentId });

    const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    const totalFees = BASE_FEE;

    const pendingAmount = totalFees - paidAmount;

    return {
      totalFees,
      paidAmount,
      pendingAmount,
      payments,
    };
  }
}
