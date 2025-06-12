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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Roles } from 'src/auth/decorators';
import { AtGuard, RolesGuard } from 'src/auth/guards';
import { Role } from '../profiles/entities/profile.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(AtGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // http://localhost:3000/courses
  @Roles(Role.ADMIN, Role.FACULTY)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  // http://localhost:3000/courses?search=Math
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter course by search',
  })
  @Roles(Role.ADMIN, Role.FACULTY, Role.STUDENT)
  @Get()
  findAll(@Query('search') search?: string) {
    return this.coursesService.findAll(search);
  }

  // http://localhost:3000/courses/1
  @Roles(Role.ADMIN, Role.FACULTY, Role.STUDENT)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  // http://localhost:3000/courses/1
  @Roles(Role.ADMIN, Role.FACULTY)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  // http://localhost:3000/courses/1
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }

  // Endpoints for managing course enrollments

  // http://localhost:3000/courses/1/students
  @Roles(Role.ADMIN)
  @Get(':id/students')
  getEnrolledStudents(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getEnrolledStudents(id);
  }

  // http://localhost:3000/courses/1/students/2
  @Roles(Role.ADMIN)
  @Post(':courseId/students/:studentId')
  addStudentToCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.coursesService.addStudentToCourse(courseId, studentId);
  }

  // http://localhost:3000/courses/1/students/2
  @Roles(Role.ADMIN)
  @Delete(':courseId/students/:studentId')
  removeStudentFromCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.coursesService.removeStudentFromCourse(courseId, studentId);
  }
}
