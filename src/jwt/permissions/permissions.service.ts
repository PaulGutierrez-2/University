import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePermissionDto) {
    return this.prisma.permission.create({ data });
  }

  findAll() {
    return this.prisma.permission.findMany();
  }

  findOne(id: number) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    });
  }

  remove(id: number) {
    return this.prisma.permission.delete({ where: { id } });
  }

  // Consulta: obtener todos los roles que tienen este permiso
  async getRolesWithPermission(id: number) {
    return this.prisma.permission
      .findUnique({
        where: { id },
        include: {
          rolePermissions: {
            include: { role: true },
          },
        },
      })
      .then((permission) => permission?.rolePermissions.map((rp) => rp.role) || []);
  }
}
