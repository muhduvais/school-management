import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { Model } from 'mongoose';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) 
    private teacherModel: Model<TeacherDocument>,
    private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateTeacherDto) {

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: 'teacher',
    });

    return this.teacherModel.create({
      name: dto.name,
      subject: dto.subject,
      experience: dto.experience,
      email: dto.email,
      user: user._id,
    });
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
