import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Importa PrismaModule para acceder a la base de datos
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
