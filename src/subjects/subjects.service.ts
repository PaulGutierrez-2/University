import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  create(createSubjectDto: CreateSubjectDto) {
    const { name, code, degreeId, professorIds, studentIds } = createSubjectDto;
    return this.prisma.subject.create({
      data: {
        name,
        code,
        degree: {
          connect: { id: degreeId },
        },
        professors: professorIds?.length
          ? { connect: professorIds.map(id => ({ id })) }
          : undefined,
        students: studentIds?.length
          ? { connect: studentIds.map(id => ({ id })) }
          : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.subject.findMany();
  }

  countStudentsInSubject(id: number) {
    return this.prisma.subject.findUnique({
      where: { id },
      include: { students: true },
    }).then(subject => ({ count: subject?.students.length || 0 }));
  }

  getProfessorOfSubject(id: number) {
    return this.prisma.subject.findUnique({
      where: { id },
      include: { professors: true },
    }).then(subject => subject?.professors);
  }

  findOne(id: number) {
    return this.prisma.subject.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateSubjectDto) {
    return this.prisma.subject.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.subject.delete({ where: { id } });
  }

  // PAGINACIÓN
  async findAllPaginated(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    // Usamos una transacción para obtener los datos y el total en una sola consulta
    const [data, total] = await this.prisma.$transaction([
      this.prisma.subject.findMany({
        skip,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.subject.count(),
    ]);
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // OPERACIONES LÓGICAS
  async findByNameOrCode(term: string) {
    return this.prisma.subject.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { code: { contains: term, mode: 'insensitive' } },
        ],
      },
    });
  }

  // =========================
  // OPERACIÓN TRANSACCIONAL
  // =========================
  /**
   * Crea una materia y asigna profesores y estudiantes en una transacción.
   * Si alguna operación falla, ninguna se aplica.
   */
  async createWithRelations(createSubjectDto: CreateSubjectDto) {
    const { name, code, degreeId, professorIds, studentIds } = createSubjectDto;
    return this.prisma.$transaction(async (tx) => {
      // 1. Crear la materia
      const subject = await tx.subject.create({
        data: {
          name,
          code,
          degree: { connect: { id: degreeId } },
        },
      });

      // 2. Asignar profesores si hay IDs
      if (professorIds?.length) {
        await tx.subject.update({
          where: { id: subject.id },
          data: {
            professors: { connect: professorIds.map(id => ({ id })) },
          },
        });
      }

      // 3. Asignar estudiantes si hay IDs
      if (studentIds?.length) {
        await tx.subject.update({
          where: { id: subject.id },
          data: {
            students: { connect: studentIds.map(id => ({ id })) },
          },
        });
      }

      // 4. Devolver la materia con sus relaciones
      return tx.subject.findUnique({
        where: { id: subject.id },
        include: { professors: true, students: true, degree: true },
      });
    });
  }
}
