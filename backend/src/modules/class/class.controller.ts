import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassService } from './class.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesEnum } from '../../common/enums/roles.enum';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateClassDto) {
    return this.classService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req: any) {
    const user = req.user;
    return this.classService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
    return this.classService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.classService.remove(id);
  }
}
