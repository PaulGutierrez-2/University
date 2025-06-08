import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardOverview() {
    // Obtener estadísticas generales usando múltiples queries
    const [
      totalUsers,
      totalStudents,
      totalProfessors,
      totalDegrees,
      totalSubjects,
      activeUsersCount
    ] = await Promise.all([
      this.prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count FROM user_details
      `,
      this.prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count FROM user_details WHERE user_type = 'Student'
      `,
      this.prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count FROM user_details WHERE user_type = 'Professor'
      `,
      this.prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count FROM degree_statistics WHERE "isActive" = true
      `,
      this.prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count FROM subject_details WHERE "isActive" = true
      `,
      this.prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count FROM user_details WHERE "isActive" = true
      `
    ]);

    return {
      totalUsers: Number(totalUsers[0].count),
      totalStudents: Number(totalStudents[0].count),
      totalProfessors: Number(totalProfessors[0].count),
      totalDegrees: Number(totalDegrees[0].count),
      totalSubjects: Number(totalSubjects[0].count),
      activeUsers: Number(activeUsersCount[0].count),
    };
  }

  async getRecentActivity() {
    const recentUsers = await this.prisma.$queryRaw<any[]>`
      SELECT name, email, user_type, "createdAt" 
      FROM user_details 
      ORDER BY "createdAt" DESC 
      LIMIT 10
    `;

    const recentRoleAssignments = await this.prisma.$queryRaw<any[]>`
      SELECT user_name, role_name, degree_name, subject_name, "assignedAt"
      FROM user_roles_details 
      ORDER BY "assignedAt" DESC 
      LIMIT 10
    `;

    return {
      recentUsers,
      recentRoleAssignments
    };
  }

  async getTopStatistics() {
    const [
      topDegreesByStudents,
      topSubjectsByStudents,
      topProfessorsBySubjects
    ] = await Promise.all([
      this.prisma.$queryRaw<any[]>`
        SELECT degree_name, total_students, total_professors, total_subjects
        FROM degree_statistics 
        WHERE "isActive" = true
        ORDER BY total_students DESC 
        LIMIT 5
      `,
      this.prisma.$queryRaw<any[]>`
        SELECT subject_name, degree_name, total_students, total_professors
        FROM subject_details 
        WHERE "isActive" = true
        ORDER BY total_students DESC 
        LIMIT 5
      `,
      this.prisma.$queryRaw<any[]>`
        SELECT professor_name, total_subjects, total_degrees, degree_names
        FROM professor_summary 
        WHERE "isActive" = true
        ORDER BY total_subjects DESC 
        LIMIT 5
      `
    ]);

    return {
      topDegreesByStudents,
      topSubjectsByStudents,
      topProfessorsBySubjects
    };
  }
}