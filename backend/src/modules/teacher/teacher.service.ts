import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { Model } from 'mongoose';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateTeacherDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: 'teacher',
    });

    try {
      const { password, ...rest } = dto;

      return await this.teacherModel.create({
        ...rest,
        user: user._id,
      });
    } catch (error) {
      await this.userModel.findByIdAndDelete(user._id);
      console.log('error: ', error);
      throw error;
    }
  }

  async findAll(page = 1, limit = 6) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.teacherModel
        .find()
        .populate('user', '-password')
        .skip(skip)
        .limit(limit)
        .exec(),
   this.teacherModel.countDocuments(),
    ]);   

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const teacher = await this.teacherModel
      .findById(id)
      .populate('user', '-password');
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async update(id: string, dto: UpdateTeacherDto) {
    const updated = await this.teacherModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('user', '-password');
    if (!updated) throw new NotFoundException('Teacher not found');
    return updated;
  }

  async remove(id: string) {
    const teacher = await this.teacherModel.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');

    await this.userModel.findByIdAndDelete(teacher.user);
    await this.teacherModel.findByIdAndDelete(id);

    return { success: true };
  }
}
