import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  name!: string;

  @IsString()
  subject!: string;

  @IsNumber()
  @IsOptional()
  experience?: number;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}