import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  create(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({ data: createRoleDto });
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(id: number) {
    return this.prisma.role.findUnique({ where: { id } });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  remove(id: number) {
    return this.prisma.role.delete({ where: { id } });
  }

  async assignPermissionsToRole(roleId: number, permissionIds: number[]) {
    // Conecta los permisos al rol en la tabla intermedia RolePermission
    const data = permissionIds.map(permissionId => ({
      roleId,
      permissionId,
    }));
    // Elimina duplicados antes de crear
    for (const item of data) {
      await this.prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: item.roleId,
            permissionId: item.permissionId,
          },
        },
        update: {},
        create: item,
      });
    }
    return { message: 'Permisos asignados correctamente' };
  }

  async getPermissionsOfRole(roleId: number) {
    return this.prisma.role
      .findUnique({
        where: { id: roleId },
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      })
      .then(role => role?.rolePermissions.map(rp => rp.permission) || []);
  }
}
