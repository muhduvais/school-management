import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  subject!: string;

  @Prop()
  experience!: number;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);