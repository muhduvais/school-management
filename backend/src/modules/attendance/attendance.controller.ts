import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  mark(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.markAttendance(dto);
  }

  @Get()
  findByClassAndDate(
    @Query('classId') classId: string,
    @Query('date') date: string,
  ) {
    return this.attendanceService.findByClassAndDate(classId, date);
  }

  @Get('class/:classId')
  getByClass(@Param('classId') classId: string) {
    return this.attendanceService.getByClass(classId);
  }
}
