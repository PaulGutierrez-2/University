import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async assignRoleToUser(userId: number, roleId: number) {
    // Verificar si ya tiene el rol
    const exists = await this.prisma.userRole.findFirst({ where: { userId, roleId } });
    if (exists) throw new Error('El usuario ya tiene este rol asignado');

    return this.prisma.userRole.create({
      data: {
        userId,
        roleId,
        assignedAt: new Date(),
        isActive: true,
      },
    });
  }

  async getUserWithRolesAndPermissions(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new Error('Usuario no encontrado');

    // Extraer roles y permisos en forma plana
    const roles = user.userRoles.map(ur => ur.role.name);
    const permissions = user.userRoles
      .flatMap(ur => ur.role.rolePermissions)
      .map(rp => `${rp.permission.resource}:${rp.permission.action}`);

    return {
      ...user,
      roles: [...new Set(roles)],
      permissions: [...new Set(permissions)],
    };
  }

}
