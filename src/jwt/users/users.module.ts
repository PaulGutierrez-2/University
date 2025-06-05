import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // <-- Importa PrismaModule

@Module({
  imports: [PrismaModule], // <-- Agrega aquí
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // <-- Esto es importante
})
export class UsersModule {}
