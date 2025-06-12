import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  Relation,
} from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { Student } from '../../students/entities/student.entity';
import { Lecturer } from '../../lecturer/entities/lecturer.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('int')
  credits: number;

  @Column({ nullable: true })
  duration: string;

  @Column('date', { nullable: true })
  startDate: string;

  @Column('date', { nullable: true })
  endDate: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Department, (department) => department.courses)
  department: Relation<Department>; // properly reference the department entity

  @ManyToMany(() => Student, (student) => student.courses)
  students: Relation<Student[]>;

  @OneToMany(() => Lecturer, (lecture) => lecture.courses)
  lecturers: Relation<Lecturer[]>;
}
