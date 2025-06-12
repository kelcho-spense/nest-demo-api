import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Relation,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Lecturer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: string; // Unique employee identifier

  @Column()
  specialization: string; // Area of expertise

  @Column({ type: 'text', nullable: true })
  bio: string; // Brief biography

  @Column({ nullable: true })
  officeLocation: string; // Office or room number

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // One-to-One relationship with Profile
  @OneToOne(() => Profile, (profile) => profile.lecturer, { cascade: true })
  @JoinColumn()
  profile: Relation<Profile>;

  // Many-to-Many relationship with Courses (lecturers can teach multiple courses)
  @ManyToMany(() => Course, { cascade: true })
  @JoinTable() // will create lecturer_courses_course join table for the many-to-many relationship
  courses: Relation<Course[]>;
}
