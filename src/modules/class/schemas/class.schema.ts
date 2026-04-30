import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema({ timestamps: true })
export class Class {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacher!: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Student', default: [] })
  students!: Types.ObjectId[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);