import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class, ClassDocument } from './schemas/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name)
    private classModel: Model<ClassDocument>,
  ) {}

  async create(dto: CreateClassDto) {
    return this.classModel.create(dto);
  }

  async findAll() {
    return this.classModel.find().populate('teacher').populate('students');
  }

  async findOne(id: string) {
    return this.classModel
      .findById(id)
      .populate('teacher')
      .populate('students');
  }

  async update(id: string, dto: UpdateClassDto) {
    return this.classModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.classModel.findByIdAndDelete(id);
  }
}
