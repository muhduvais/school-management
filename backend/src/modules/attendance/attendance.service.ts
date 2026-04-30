import { BadRequestException, Injectable } from '@nestjs/common';
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
    try {
      const normalizedDate = new Date(dto.date);
      normalizedDate.setHours(0, 0, 0, 0);

      return await this.attendanceModel.create({
        ...dto,
        date: normalizedDate,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        throw new BadRequestException(
          'Attendance already marked for this student on this date',
        );
      }
      throw err;
    }
  }

  async findByClassAndDate(classId: string, date: string) {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    return this.attendanceModel
      .find({ class: classId, date: normalizedDate })
      .populate('student');
  }
}
