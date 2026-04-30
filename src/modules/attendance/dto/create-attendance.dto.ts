import { IsMongoId, IsEnum, IsDateString } from 'class-validator';
import { AttendanceStatus } from '../../../common/enums/attendance-status.enum';

export class CreateAttendanceDto {
  @IsMongoId()
  student!: string;

  @IsMongoId()
  class!: string;

  @IsDateString()
  date!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;
}