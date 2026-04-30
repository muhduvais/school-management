import { IsString, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name!: string;

  @IsString()
  rollNumber!: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsMongoId()
  @IsOptional()
  class?: string;
}