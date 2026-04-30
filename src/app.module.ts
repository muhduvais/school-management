import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { UsersModule } from './modules/users/users.module';
import { StudentService } from './modules/student/student.service';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ClassModule } from './modules/class/class.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    StudentModule,
    TeacherModule,
    ClassModule,
  ],
  providers: [StudentService],
})
export class AppModule {}