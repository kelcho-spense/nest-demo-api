import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'The name of the department',
    example: 'Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A description of the department',
    example:
      'The Computer Science department focuses on software engineering, algorithms, and data structures.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The name or ID of the faculty head of the department',
    example: 'Dr. Jane Smith',
    required: false,
  })
  @IsString()
  @IsOptional()
  headOfDepartment?: string; // Name or ID of the faculty head
}
