import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    description: 'The enrollment date of the student',
    example: '2023-09-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  enrollmentDate: string;

  @ApiProperty({
    description: 'The degree program of the student',
    example: 'Computer Science',
    required: false,
  })
  @IsString()
  @IsOptional()
  degreeProgram?: string;

  @ApiProperty({
    description: 'The GPA of the student (0.0 to 4.0)',
    example: 3.75,
    minimum: 0,
    maximum: 4.0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(4.0)
  @IsOptional()
  gpa?: number;

  @ApiProperty({
    description: 'The ID of the department the student belongs to',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  departmentId?: number;

  @ApiProperty({
    description: 'The profile ID associated with the student',
    example: 1,
  })
  @IsNumber()
  profileId: number; // Assuming profileId is a string, adjust if it's a number or UUID
}
