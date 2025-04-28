import { Module } from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { ProfessorsController } from './professors.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProfessorsController],
  providers: [ProfessorsService],
  imports: [PrismaModule],
})
export class ProfessorsModule {}
