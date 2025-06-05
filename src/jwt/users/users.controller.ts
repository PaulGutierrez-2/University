import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin') // Solo admin puede crear usuarios
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin', 'profesor') // Solo admin y profesor pueden ver todos los usuarios
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'profesor', 'usuario') // Estos roles pueden ver un usuario
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Patch(':id')
  @Roles('admin') // Solo admin puede actualizar usuarios
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @Roles('admin') // Solo admin puede eliminar usuarios
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }

  @Post(':id/roles/:roleId')
  @Roles('admin') // Solo admin puede asignar roles
  assignRoleToUser(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.usersService.assignRoleToUser(Number(id), Number(roleId));
  }

  @Get(':id/roles-permissions')
  @Roles('admin', 'profesor') // Solo admin y profesor pueden ver roles y permisos de un usuario
  getUserWithRolesAndPermissions(@Param('id') id: string) {
    return this.usersService.getUserWithRolesAndPermissions(Number(id));
  }
}
