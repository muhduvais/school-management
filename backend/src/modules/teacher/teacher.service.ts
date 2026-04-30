import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { Model } from 'mongoose';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(dto: CreateTeacherDto) {
    return await this.teacherModel.create(dto);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const data = await this.teacherModel.find().skip(skip).limit(limit);
    const total = await this.teacherModel.countDocuments();

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    return await this.teacherModel.findById(id);
  }

  async update(id: string, dto: UpdateTeacherDto) {
    return await this.teacherModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    await this.teacherModel.findByIdAndDelete(id);
  }
}
