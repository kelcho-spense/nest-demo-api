import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateLecturerDto {
  @ApiProperty({
    description: 'The employee ID of the lecturer',
    example: 'EMP001',
  })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({
    description: 'The specialization or field of expertise of the lecturer',
    example: 'Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiProperty({
    description: 'A brief biography of the lecturer',
    example: 'Dr. Smith has 10 years of experience in software engineering.',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: 'The office location of the lecturer',
    example: 'Room 201, Computer Science Building',
    required: false,
  })
  @IsString()
  @IsOptional()
  officeLocation?: string;

  @ApiProperty({
    description: 'The phone number of the lecturer',
    example: '+1-555-123-4567',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The profile ID associated with the lecturer',
    example: 1,
  })
  @IsNumber()
  profileId: number; // Reference to existing profile
}
