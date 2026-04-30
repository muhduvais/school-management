import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  rollNumber!: string;

  @Prop()
  age!: number;

  @Prop()
  contact!: string;

  @Prop({ type: Types.ObjectId, ref: 'Class' })
  class!: Types.ObjectId;

  @Prop({ default: 0 })
  fees!: number;

  @Prop({ default: false })
  isPaid!: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
