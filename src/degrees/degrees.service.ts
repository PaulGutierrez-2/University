import { Injectable } from '@nestjs/common';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DegreesService {

  constructor( private prisma: PrismaService ) {}

  create(createDegreeDto: CreateDegreeDto) {
    return this.prisma.degree.create({
      data: createDegreeDto,
    });
  }

  findAll() {
    return this.prisma.degree.findMany();
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
}
