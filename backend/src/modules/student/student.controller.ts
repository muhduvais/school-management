import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesEnum } from '../../common/enums/roles.enum';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query('page') page = 1, @Query('limit') limit = 5) {
    return this.studentService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.studentService.remove(id);
  }

  @Patch(':id/pay')
  @HttpCode(HttpStatus.OK)
  markPaid(@Param('id') id: string) {
    return this.studentService.markPaid(id);
  }
}
