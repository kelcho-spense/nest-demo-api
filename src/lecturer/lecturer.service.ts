import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLecturerDto, UpdateLecturerDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecturer } from './entities/lecturer.entity';
import { Repository, In } from 'typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class LecturerService {
  constructor(
    @InjectRepository(Lecturer)
    private lecturerRepository: Repository<Lecturer>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  async create(createLecturerDto: CreateLecturerDto): Promise<Lecturer> {
    // Check if profile exists and is not already associated with a lecturer
    const existingProfile = await this.profileRepository.findOneBy({
      id: createLecturerDto.profileId,
    });

    if (!existingProfile) {
      throw new NotFoundException(
        `Profile with ID ${createLecturerDto.profileId} not found`,
      );
    }

    // Create a new Lecturer entity with the profile relation
    const newLecturer = this.lecturerRepository.create({
      employeeId: createLecturerDto.employeeId,
      specialization: createLecturerDto.specialization,
      bio: createLecturerDto.bio,
      officeLocation: createLecturerDto.officeLocation,
      phoneNumber: createLecturerDto.phoneNumber,
      profile: existingProfile,
    });

    return this.lecturerRepository.save(newLecturer);
  }

  async findAll(name?: string): Promise<Lecturer[] | Lecturer> {
    if (name) {
      return await this.lecturerRepository.find({
        where: {
          profile: {
            firstName: name,
          },
        },
        relations: ['profile', 'courses'], // Added courses relation
      });
    }
    return await this.lecturerRepository.find({
      relations: ['profile', 'courses'], // Added courses relation
    });
  }

  async findOne(id: number): Promise<Lecturer | string> {
    return await this.lecturerRepository
      .findOne({
        where: { id },
        relations: ['profile', 'courses'], // Added courses relation
      })
      .then((lecturer) => {
        if (!lecturer) {
          return `No lecturer found with id ${id}`;
        }
        return lecturer;
      })
      .catch((error) => {
        console.error('Error finding lecturer:', error);
        throw new Error(`Failed to find lecturer with id ${id}`);
      });
  }

  async update(id: number, updateLecturerDto: UpdateLecturerDto) {
    return await this.lecturerRepository
      .update(id, updateLecturerDto)
      .then((result) => {
        if (result.affected === 0) {
          return `No lecturer found with id ${id}`;
        }
      })
      .catch((error) => {
        console.error('Error updating lecturer:', error);
        throw new Error(`Failed to update lecturer with id ${id}`);
      });
  }

  async remove(id: number): Promise<string> {
    return await this.lecturerRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `No lecturer found with id ${id}`;
        }
        return `Lecturer with id ${id} has been removed`;
      })
      .catch((error) => {
        console.error('Error removing lecturer:', error);
        throw new Error(`Failed to remove lecturer with id ${id}`);
      });
  }

  async assignLecturerToCourse(
    lecturerId: number,
    courseId: number,
  ): Promise<Lecturer> {
    // Find the lecturer with courses relation
    const lecturer = await this.lecturerRepository.findOne({
      where: { id: lecturerId },
      relations: ['courses'],
    });

    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID ${lecturerId} not found`);
    }

    // Find the course
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Initialize courses array if it doesn't exist
    if (!lecturer.courses) {
      lecturer.courses = [];
    }

    // Check if already assigned
    const isAlreadyAssigned = lecturer.courses.some(
      (assignedCourse) => assignedCourse.id === courseId,
    );

    if (!isAlreadyAssigned) {
      lecturer.courses.push(course);
      await this.lecturerRepository.save(lecturer);
    }

    return lecturer;
  }

  async unassignLecturerFromCourse(
    lecturerId: number,
    courseId: number,
  ): Promise<Lecturer> {
    // Find the lecturer with courses relation
    const lecturer = await this.lecturerRepository.findOne({
      where: { id: lecturerId },
      relations: ['courses'],
    });

    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID ${lecturerId} not found`);
    }

    // Check if the lecturer is assigned to the course
    if (!lecturer.courses || lecturer.courses.length === 0) {
      throw new NotFoundException(
        `Lecturer with ID ${lecturerId} is not assigned to any courses`,
      );
    }

    // Filter out the course to unassign from
    lecturer.courses = lecturer.courses.filter(
      (course) => course.id !== courseId,
    );

    // Save the updated lecturer
    return this.lecturerRepository.save(lecturer);
  }

  async getLecturerCourses(lecturerId: number): Promise<Course[]> {
    const lecturer = await this.lecturerRepository.findOne({
      where: { id: lecturerId },
      relations: ['courses'],
    });

    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID ${lecturerId} not found`);
    }

    return lecturer.courses || [];
  }

  async updateLecturerCourses(
    lecturerId: number,
    courseIds: number[],
  ): Promise<Lecturer> {
    // Find the lecturer with courses relation
    const lecturer = await this.lecturerRepository.findOne({
      where: { id: lecturerId },
      relations: ['courses'],
    });

    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID ${lecturerId} not found`);
    }

    // Find all courses by IDs
    const courses = await this.courseRepository.findBy({
      id: In(courseIds),
    });

    if (courses.length !== courseIds.length) {
      const foundIds = courses.map((course) => course.id);
      const missingIds = courseIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Courses with IDs ${missingIds.join(', ')} not found`,
      );
    }

    // Replace lecturer's courses with the new selection
    lecturer.courses = courses;

    // Save the updated lecturer
    return this.lecturerRepository.save(lecturer);
  }
}
