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

@Module({
  imports: [StudentsModule, DegreesModule, SubjectsModule, ProfessorsModule, PrismaModule, AuthModule, UsersModule, RolesModule, PermissionsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
