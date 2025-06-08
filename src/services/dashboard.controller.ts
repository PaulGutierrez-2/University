import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { UserDetailsService } from '../services/user-details.service';
import { AcademicStatsService } from '../services/academic-stats.service';
import { RolePermissionsService } from '../services/role-permissions.service';
import { DashboardService } from '../services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly userDetailsService: UserDetailsService,
    private readonly academicStatsService: AcademicStatsService,
    private readonly rolePermissionsService: RolePermissionsService,
    private readonly dashboardService: DashboardService,
  ) {}

  @Get('overview')
  async getDashboardOverview() {
    return this.dashboardService.getDashboardOverview();
  }

  @Get('activity')
  async getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }

  @Get('top-stats')
  async getTopStatistics() {
    return this.dashboardService.getTopStatistics();
  }

  @Get('users')
  async getUsers(
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    if (search) {
      return this.userDetailsService.searchUsersByName(search);
    }
    
    if (page && limit) {
      return this.userDetailsService.getUsersPaginated(page, limit);
    }
    
    if (type) {
      return this.userDetailsService.getUsersByType(type);
    }
    
    return this.userDetailsService.getAllUsers();
  }

  @Get('users/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userDetailsService.getUserById(id);
  }

  @Get('degrees')
  async getDegrees() {
    return this.academicStatsService.getDegreeStatistics();
  }

  @Get('degrees/:id')
  async getDegreeById(@Param('id', ParseIntPipe) id: number) {
    return this.academicStatsService.getDegreeById(id);
  }

  @Get('professors')
  async getProfessors(@Query('limit') limit?: number) {
    if (limit) {
      return this.academicStatsService.getTopProfessorsBySubjects(limit);
    }
    return this.academicStatsService.getProfessorSummary();
  }

  @Get('students')
  async getStudents(@Query('degree') degree?: string) {
    if (degree) {
      return this.academicStatsService.getStudentsByDegree(degree);
    }
    return this.academicStatsService.getStudentSummary();
  }

  @Get('subjects')
  async getSubjects(
    @Query('degreeId') degreeId?: number,
    @Query('limit') limit?: number
  ) {
    if (degreeId) {
      return this.academicStatsService.getSubjectsByDegree(degreeId);
    }
    
    if (limit) {
      return this.academicStatsService.getSubjectsWithMostStudents(limit);
    }
    
    return this.academicStatsService.getSubjectDetails();
  }

  @Get('roles')
  async getRoles() {
    return this.rolePermissionsService.getRolePermissionsSummary();
  }

  @Get('user-roles')
  async getUserRoles(
    @Query('userId') userId?: number,
    @Query('role') role?: string,
    @Query('degree') degree?: string,
    @Query('subject') subject?: string
  ) {
    if (userId) {
      return this.rolePermissionsService.getUserRoleDetails(userId);
    }
    
    if (role) {
      return this.rolePermissionsService.getUsersByRole(role);
    }
    
    if (degree) {
      return this.rolePermissionsService.getUserRolesByDegree(degree);
    }
    
    if (subject) {
      return this.rolePermissionsService.getUserRolesBySubject(subject);
    }
    
    return this.rolePermissionsService.getUserRoleDetails();
  }
}
