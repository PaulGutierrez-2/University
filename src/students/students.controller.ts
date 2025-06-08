import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('students')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('admin')
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  // Paginación de estudiantes
  @Get('paginated')
  @Roles('admin', 'profesor')
  findAllPaginated(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10'
  ) {
    return this.studentsService.findAllPaginated(Number(page), Number(pageSize));
  }

  // Búsqueda lógica por código o email de usuario
  @Get('search')
  @Roles('admin', 'profesor')
  findByCodeOrUser(@Query('term') term: string) {
    return this.studentsService.findByCodeOrUser(term);
  }

  @Get(':id')
  @Roles('admin', 'profesor', 'usuario')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
