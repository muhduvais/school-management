import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
import { Model } from 'mongoose';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
  ) {}

  async markAttendance(dto: CreateAttendanceDto) {
    return this.attendanceModel.create(dto);
  }

  async findByClassAndDate(classId: string, date: string) {
    return this.attendanceModel
      .find({ class: classId, date })
      .populate('student');
  }
}
