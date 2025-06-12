import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The title of the course',
    example: 'Introduction to Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'A detailed description of the course',
    example:
      'This course covers fundamental concepts in computer science including algorithms, data structures, and programming.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The ID of the department offering this course',
    example: 1,
  })
  @IsInt()
  departmentId: number; // Assuming department_id is a number representing the department

  @ApiProperty({
    description: 'The number of credits for this course',
    example: 3,
  })
  @IsInt()
  credits: number;

  @ApiProperty({
    description: 'The duration of the course',
    example: '6 weeks',
    required: false,
  })
  @IsString()
  @IsOptional()
  duration?: string; // e.g., "6 weeks"

  @ApiProperty({
    description: 'The start date of the course',
    example: '2023-09-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'The end date of the course',
    example: '2023-12-15T00:00:00.000Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
