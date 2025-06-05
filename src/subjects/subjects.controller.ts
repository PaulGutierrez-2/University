import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('subjects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  // Crear materia simple
  @Post()
  @Roles('admin')
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  // Crear materia con relaciones (transaccional)
  @Post('with-relations')
  @Roles('admin')
  createWithRelations(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.createWithRelations(createSubjectDto);
  }

  // Obtener todas las materias (sin paginación)
  @Get()
  @Roles('admin', 'profesor')
  findAll() {
    return this.subjectsService.findAll();
  }

  // Paginación de materias
  @Get('paginated')
  @Roles('admin', 'profesor')
  findAllPaginated(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10'
  ) {
    return this.subjectsService.findAllPaginated(Number(page), Number(pageSize));
  }

  // Búsqueda lógica por nombre o código
  @Get('search')
  @Roles('admin', 'profesor')
  findByNameOrCode(@Query('term') term: string) {
    return this.subjectsService.findByNameOrCode(term);
  }

  // Cantidad de estudiantes en una materia
  @Get(':id/student-count')
  @Roles('admin', 'profesor')
  countStudentsInSubject(@Param('id') id: string) {
    return this.subjectsService.countStudentsInSubject(+id);
  }

  // Profesores de una materia
  @Get(':id/professor')
  @Roles('admin', 'profesor')
  getProfessorOfSubject(@Param('id') id: string) {
    return this.subjectsService.getProfessorOfSubject(+id)
  }

  // Obtener una materia por ID
  @Get(':id')
  @Roles('admin', 'profesor', 'usuario')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(+id);
  }

  // Actualizar materia
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(+id, updateSubjectDto);
  }

  // Eliminar materia
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
  }
}
