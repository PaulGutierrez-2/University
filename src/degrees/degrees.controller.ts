import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('degrees')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @Post()
  @Roles('admin')
  create(@Body() createDegreeDto: CreateDegreeDto) {
    return this.degreesService.create(createDegreeDto);
  }

  // Crear degree con relaciones (transaccional)
  @Post('with-relations')
  @Roles('admin')
  createWithRelations(@Body() createDegreeDto: CreateDegreeDto & { professorIds?: number[], studentIds?: number[] }) {
    return this.degreesService.createWithRelations(createDegreeDto);
  }

  @Get()
  @Roles('admin', 'profesor')
  findAll() {
    return this.degreesService.findAll();
  }

  // Paginación de degrees
  @Get('paginated')
  @Roles('admin', 'profesor')
  findAllPaginated(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10'
  ) {
    return this.degreesService.findAllPaginated(Number(page), Number(pageSize));
  }

  // Búsqueda lógica por nombre o código
  @Get('search')
  @Roles('admin', 'profesor')
  findByNameOrCode(@Query('term') term: string) {
    return this.degreesService.findByNameOrCode(term);
  }

  @Get(':id/student-count')
  @Roles('admin', 'profesor')
  countStudentsInDegree(@Param('id') id: string) {
    return this.degreesService.countStudentsInDegree(+id);
  }

  @Get(':id/professor')
  @Roles('admin', 'profesor')
  getProfessorOfDegree(@Param('id') id: string) {
    return this.degreesService.getProfessorOfSubject(+id);
  }

  @Get(':id')
  @Roles('admin', 'profesor', 'usuario')
  findOne(@Param('id') id: string) {
    return this.degreesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateDegreeDto: UpdateDegreeDto) {
    return this.degreesService.update(+id, updateDegreeDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.degreesService.remove(+id);
  }
}
