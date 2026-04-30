import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class, ClassDocument } from './schemas/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Teacher, TeacherDocument } from '../teacher/schemas/teacher.schema';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name)
    private classModel: Model<ClassDocument>,
    @InjectModel(Teacher.name)
    private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(dto: CreateClassDto) {
    return await this.classModel.create(dto);
  }

  async findAll() {
    return this.classModel
      .find()
      .populate('teacher')
      .populate('students');
  }

  async findOne(id: string) {
    return await this.classModel
      .findById(id)
      .populate('teacher')
      .populate('students');
  }

  async update(id: string, dto: UpdateClassDto) {
    return await this.classModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    await this.classModel.findByIdAndDelete(id);
  }
}
