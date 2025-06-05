import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {

  constructor( private prisma: PrismaService) {}

  create(createStudentDto: CreateStudentDto) {
    const { userId, code, degreeIds, subjectIds } = createStudentDto;
  
    return this.prisma.student.create({
      data: {
        userId,
        code,
        degrees: degreeIds?.length
          ? { connect: degreeIds.map(id => ({ id })) }
          : undefined,
        subjects: subjectIds?.length
          ? { connect: subjectIds.map(id => ({ id })) }
          : undefined,
      },
    });
  }
  
  findAll() {
    return this.prisma.student.findMany();
  }

  // PAGINACIÓN
  async findAllPaginated(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.student.findMany({
        skip,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.student.count(),
    ]);
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // OPERACIÓN LÓGICA: Buscar por código o userId
  async findByCodeOrUser(term: string) {
    return this.prisma.student.findMany({
      where: {
        OR: [
          { code: { contains: term, mode: 'insensitive' } },
          { user: { email: { contains: term, mode: 'insensitive' } } },
        ],
      },
      include: { user: true },
    });
  }

  getSubjectAndDegreeOfStudent(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
      include: { subjects: true, degrees: true },
    })
  }

  findOne(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
    });
  }
  
  update(id: number, data: UpdateStudentDto) {
    return this.prisma.student.update({where: { id }, data});
  }

  remove(id: number) {
    return this.prisma.student.delete({where: { id }})
  }
}
