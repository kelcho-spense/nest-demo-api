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
import { LecturerService } from './lecturer.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { Public, Roles } from 'src/auth/decorators';
import { AtGuard, RolesGuard } from 'src/auth/guards';
import { Role } from 'src/profiles/entities/profile.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('lecturer')
@ApiBearerAuth()
@Controller('lecturer')
@UseGuards(AtGuard, RolesGuard)
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Public()
  @Post()
  create(@Body() createLecturerDto: CreateLecturerDto) {
    return this.lecturerService.create(createLecturerDto);
  }

  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter students by name',
  })
  @Roles(Role.ADMIN, Role.FACULTY)
  @Get()
  findAll(@Query('name') name?: string) {
    return this.lecturerService.findAll(name);
  }

  @Roles(Role.ADMIN, Role.FACULTY)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lecturerService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.FACULTY)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLecturerDto: UpdateLecturerDto,
  ) {
    return this.lecturerService.update(id, updateLecturerDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lecturerService.remove(id);
  }

  // Lecturer-Course assignment endpoints

  // Get all courses for a lecturer
  @Roles(Role.ADMIN, Role.FACULTY)
  @Get(':id/courses')
  getLecturerCourses(@Param('id', ParseIntPipe) id: number) {
    return this.lecturerService.getLecturerCourses(id);
  }

  // Assign a lecturer to a course
  @Roles(Role.ADMIN, Role.FACULTY)
  @Post(':lecturerId/courses/:courseId')
  assignLecturerToCourse(
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.lecturerService.assignLecturerToCourse(lecturerId, courseId);
  }

  // Unassign a lecturer from a course
  @Roles(Role.ADMIN, Role.FACULTY)
  @Delete(':lecturerId/courses/:courseId')
  unassignLecturerFromCourse(
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.lecturerService.unassignLecturerFromCourse(
      lecturerId,
      courseId,
    );
  }

  // Update lecturer's courses (batch assignment)
  @Roles(Role.ADMIN, Role.FACULTY)
  @Patch(':id/courses')
  updateLecturerCourses(
    @Param('id', ParseIntPipe) id: number,
    @Body() courseIds: number[],
  ) {
    return this.lecturerService.updateLecturerCourses(id, courseIds);
  }
}
