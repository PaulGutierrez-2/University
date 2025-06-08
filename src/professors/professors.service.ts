import { Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfessorsService {

  constructor( private prisma: PrismaService) {}

  // Crear profesor simple
  create(createProfessorDto: CreateProfessorDto) {
    const { userId, code, subjectIds, degreeIds } = createProfessorDto;
    return this.prisma.professor.create({
      data: {
        userId,
        code,
        subjects: subjectIds?.length
          ? { connect: subjectIds.map(id => ({ id })) }
          : undefined,
        degrees: degreeIds?.length
          ? { connect: degreeIds.map(id => ({ id })) }
          : undefined,
      },
    });
  }

  // PAGINACIÓN
  async findAllPaginated(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.professor.findMany({
        skip,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.professor.count(),
    ]);
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // OPERACIÓN LÓGICA: Buscar por código o email de usuario
  async findByCodeOrUser(term: string) {
    return this.prisma.professor.findMany({
      where: {
        OR: [
          { code: { contains: term, mode: 'insensitive' } },
          { user: { email: { contains: term, mode: 'insensitive' } } },
        ],
      },
      include: { user: true },
    });
  }

  // OPERACIÓN TRANSACCIONAL: Crear profesor y asignar grados y materias
  async createWithRelations(createProfessorDto: CreateProfessorDto) {
    const { userId, code, subjectIds, degreeIds } = createProfessorDto;
    return this.prisma.$transaction(async (tx) => {
      const professor = await tx.professor.create({
        data: {
          userId,
          code,
        },
      });

      if (subjectIds?.length) {
        await tx.professor.update({
          where: { id: professor.id },
          data: {
            subjects: { connect: subjectIds.map(id => ({ id })) },
          },
        });
      }

      if (degreeIds?.length) {
        await tx.professor.update({
          where: { id: professor.id },
          data: {
            degrees: { connect: degreeIds.map(id => ({ id })) },
          },
        });
      }

      return tx.professor.findUnique({
        where: { id: professor.id },
        include: { subjects: true, degrees: true, user: true },
      });
    });
  }

  findOne(id: number) {
    return this.prisma.professor.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateProfessorDto) {
    return this.prisma.professor.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.professor.delete({ where: { id } });
  }
}
