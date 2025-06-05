import { Injectable } from '@nestjs/common';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DegreesService {

  constructor( private prisma: PrismaService ) {}

  create(data: CreateDegreeDto) {
    return this.prisma.degree.create({data});
  }

  findAll() {
    return this.prisma.degree.findMany();
  }

  // PAGINACIÓN
  async findAllPaginated(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.degree.findMany({
        skip,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.degree.count(),
    ]);
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // OPERACIÓN LÓGICA: Buscar por nombre o código
  async findByNameOrCode(term: string) {
    return this.prisma.degree.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { code: { contains: term, mode: 'insensitive' } },
        ],
      },
    });
  }

  countStudentsInDegree(id: number) {
    return this.prisma.degree.findUnique({
      where: { id },
      include: { students: true },
    }).then(degree => ({ count: degree?.students.length || 0 }));
  }

  getProfessorOfSubject(id: number) {
    return this.prisma.degree.findUnique({
      where: { id },
      include: { professors: true },
    }).then(subject => subject?.professors)
  }

  findOne(id: number) {
    return this.prisma.degree.findUnique({where: { id }});
  }

  update(id: number, data: UpdateDegreeDto) {
    return this.prisma.degree.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.degree.delete({where: { id }});
  }

  // OPERACIÓN TRANSACCIONAL: Crear degree y asignar profesores y estudiantes
  async createWithRelations(createDegreeDto: CreateDegreeDto & { professorIds?: number[], studentIds?: number[] }) {
    const { name, code, isActive, professorIds, studentIds } = createDegreeDto;
    return this.prisma.$transaction(async (tx) => {
      const degree = await tx.degree.create({
        data: { name, code, isActive },
      });

      if (professorIds?.length) {
        await tx.degree.update({
          where: { id: degree.id },
          data: {
            professors: { connect: professorIds.map(id => ({ id })) },
          },
        });
      }

      if (studentIds?.length) {
        await tx.degree.update({
          where: { id: degree.id },
          data: {
            students: { connect: studentIds.map(id => ({ id })) },
          },
        });
      }

      return tx.degree.findUnique({
        where: { id: degree.id },
        include: { professors: true, students: true },
      });
    });
  }
}
