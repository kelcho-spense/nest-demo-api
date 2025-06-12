import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto';
import { Roles } from 'src/auth/decorators';
import { AtGuard, RolesGuard } from 'src/auth/guards';
import { Role } from 'src/profiles/entities/profile.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('students')
@ApiBearerAuth()
@Controller('students')
@UseGuards(AtGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // http://localhost:8000/students
  @Roles(Role.ADMIN, Role.FACULTY)
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  // http://localhost:8000/students?name=John
  @Roles(Role.ADMIN, Role.FACULTY)
  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter students by name',
  })
  findAll(@Query('name') name?: string) {
    return this.studentsService.findAll(name);
  }

  // http://localhost:8000/students/1
  @Roles(Role.ADMIN, Role.FACULTY, Role.STUDENT)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  // http://localhost:8000/students/1
  @Roles(Role.ADMIN, Role.FACULTY)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  // http://localhost:8000/students/1
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }

  // http://localhost:8000/students/1/courses
  @Roles(Role.ADMIN, Role.FACULTY, Role.STUDENT)
  @Get(':id/courses')
  getStudentCourses(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.getStudentCourses(id);
  }

  // http://localhost:8000/students/1/courses/2
  @Roles(Role.ADMIN, Role.FACULTY)
  @Post(':studentId/courses/:courseId')
  enrollStudentInCourse(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.studentsService.enrollStudentInCourse(studentId, courseId);
  }

  // http://localhost:8000/students/1/courses/2
  @Roles(Role.ADMIN, Role.FACULTY)
  @Delete(':studentId/courses/:courseId')
  unenrollStudentFromCourse(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.studentsService.unenrollStudentFromCourse(studentId, courseId);
  }

  // http://localhost:8000/students/1/courses
  @Roles(Role.ADMIN, Role.FACULTY)
  @Patch(':id/courses')
  updateStudentCourses(
    @Param('id', ParseIntPipe) id: number,
    @Body() courseIds: number[],
  ) {
    return this.studentsService.updateStudentCourses(id, courseIds);
  }
}
