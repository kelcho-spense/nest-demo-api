import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Department, Profile])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, RolesGuard],
})
export class DepartmentsModule {}
