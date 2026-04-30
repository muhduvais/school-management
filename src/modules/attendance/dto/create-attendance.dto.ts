import { IsMongoId, IsEnum, IsDateString } from 'class-validator';

export class CreateAttendanceDto {
  @IsMongoId()
  student!: string;

  @IsMongoId()
  class!: string;

  @IsDateString()
  date!: string;

  @IsEnum(['present', 'absent'])
  status!: string;
}