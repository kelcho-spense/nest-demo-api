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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';
import { Roles } from 'src/auth/decorators';
import { AtGuard, RolesGuard } from 'src/auth/guards';
import { Role } from '../profiles/entities/profile.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('departments')
@ApiBearerAuth()
@Controller('departments')
@UseGuards(AtGuard, RolesGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Roles(Role.ADMIN, Role.FACULTY)
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter department by search',
  })
  @Roles(Role.ADMIN, Role.FACULTY, Role.STUDENT)
  @Get()
  findAll(@Query('search') search?: string) {
    return this.departmentsService.findAll(search);
  }

  @Roles(Role.ADMIN, Role.FACULTY, Role.STUDENT)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.FACULTY)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.remove(id);
  }
}
