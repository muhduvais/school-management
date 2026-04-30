import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(dto: CreateStudentDto) {
    return await this.studentModel.create(dto);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const data = await this.studentModel.find().skip(skip).limit(limit);

    const total = await this.studentModel.countDocuments();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    return await this.studentModel.findById(id);
  }

  async update(id: string, dto: UpdateStudentDto) {
    return await this.studentModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    await this.studentModel.findByIdAndDelete(id);
  }

  async markPaid(id: string) {
    return this.studentModel.findByIdAndUpdate(
      id,
      { isPaid: true },
      { new: true },
    );
  }
}
