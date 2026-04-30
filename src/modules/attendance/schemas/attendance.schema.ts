import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AttendanceStatus } from '../../../common/enums/attendance-status.enum';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  class!: Types.ObjectId;

  @Prop({ required: true })
  date!: Date;

  @Prop({ enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
  status!: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);