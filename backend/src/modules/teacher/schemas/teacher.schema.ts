import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);