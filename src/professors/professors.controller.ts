import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('professors')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Post()
  @Roles('admin')
  create(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorsService.create(createProfessorDto);
  }

  // Crear profesor con relaciones (transaccional)
  @Post('with-relations')
  @Roles('admin')
  createWithRelations(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorsService.createWithRelations(createProfessorDto);
  }

  @Get()
  @Roles('admin', 'profesor')
  findAll() {
    return this.professorsService.findAll();
  }

  // Paginación de profesores
  @Get('paginated')
  @Roles('admin', 'profesor')
  findAllPaginated(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10'
  ) {
    return this.professorsService.findAllPaginated(Number(page), Number(pageSize));
  }

  // Búsqueda lógica por código o email de usuario
  @Get('search')
  @Roles('admin', 'profesor')
  findByCodeOrUser(@Query('term') term: string) {
    return this.professorsService.findByCodeOrUser(term);
  }

  @Get(':id')
  @Roles('admin', 'profesor')
  findOne(@Param('id') id: string) {
    return this.professorsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateProfessorDto: UpdateProfessorDto) {
    return this.professorsService.update(+id, updateProfessorDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.professorsService.remove(+id);
  }
}
