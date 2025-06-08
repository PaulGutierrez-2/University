import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { DegreesModule } from './degrees/degrees.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ProfessorsModule } from './professors/professors.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './jwt/permissions/permissions.module';
import { RolesModule } from './jwt/roles/roles.module';
import { UsersModule } from './jwt/users/users.module';
import { DashboardController } from './services/dashboard.controller';
import { UserDetailsService } from './services/user-details.service';
import { AcademicStatsService } from './services/academic-stats.service';
import { RolePermissionsService } from './services/role-permissions.service';
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [StudentsModule, DegreesModule, SubjectsModule, ProfessorsModule, PrismaModule, AuthModule, UsersModule, RolesModule, PermissionsModule],
  controllers: [AppController, DashboardController],
  providers: [
    AppService,
    PrismaService,
    UserDetailsService,
    AcademicStatsService,
    RolePermissionsService,
    DashboardService,
  ],
})
export class AppModule {}
