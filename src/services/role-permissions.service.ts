import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRoleDetails, RolePermissionsSummary } from '../types/view-types';

@Injectable()
export class RolePermissionsService {
  constructor(private prisma: PrismaService) {}

  async getUserRoleDetails(userId?: number): Promise<UserRoleDetails[]> {
    if (userId) {
      const userRoles = await this.prisma.$queryRaw<UserRoleDetails[]>`
        SELECT * FROM user_roles_details 
        WHERE user_id = ${userId} AND "isActive" = true
        ORDER BY user_name ASC
      `;
      return userRoles;
    }

    const userRoles = await this.prisma.$queryRaw<UserRoleDetails[]>`
      SELECT * FROM user_roles_details 
      WHERE "isActive" = true
      ORDER BY user_name ASC
    `;
    return userRoles;
  }

  async getRolePermissionsSummary(): Promise<RolePermissionsSummary[]> {
    const rolePermissions = await this.prisma.$queryRaw<RolePermissionsSummary[]>`
      SELECT * FROM role_permissions_summary 
      ORDER BY role_name ASC
    `;
    return rolePermissions;
  }

  async getUsersByRole(roleName: string): Promise<UserRoleDetails[]> {
    const users = await this.prisma.$queryRaw<UserRoleDetails[]>`
      SELECT * FROM user_roles_details 
      WHERE role_name = ${roleName} AND "isActive" = true
      ORDER BY user_name ASC
    `;
    return users;
  }

  async getUserRolesByDegree(degreeName: string): Promise<UserRoleDetails[]> {
    const userRoles = await this.prisma.$queryRaw<UserRoleDetails[]>`
      SELECT * FROM user_roles_details 
      WHERE degree_name = ${degreeName} AND "isActive" = true
      ORDER BY user_name ASC
    `;
    return userRoles;
  }

  async getUserRolesBySubject(subjectName: string): Promise<UserRoleDetails[]> {
    const userRoles = await this.prisma.$queryRaw<UserRoleDetails[]>`
      SELECT * FROM user_roles_details 
      WHERE subject_name = ${subjectName} AND "isActive" = true
      ORDER BY user_name ASC
    `;
    return userRoles;
  }

  async getRoleWithMostPermissions(): Promise<RolePermissionsSummary | null> {
    const roles = await this.prisma.$queryRaw<RolePermissionsSummary[]>`
      SELECT * FROM role_permissions_summary 
      ORDER BY total_permissions DESC
      LIMIT 1
    `;
    return roles[0] || null;
  }
}