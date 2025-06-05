import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Import PrismaModule to access the database
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
