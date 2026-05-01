import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTeacherDto) {
    return this.teacherService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query('page') page = 1, @Query('limit') limit = 6) {
    return this.teacherService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.teacherService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.teacherService.remove(id);
  }
}
