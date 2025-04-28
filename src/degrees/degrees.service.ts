import { Injectable } from '@nestjs/common';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Degree } from 'generated/prisma';

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
    return `This action returns a #${id} degree`;
  }

  update(id: number, updateDegreeDto: UpdateDegreeDto) {
    return `This action updates a #${id} degree`;
  }

  remove(id: number) {
    return `This action removes a #${id} degree`;
  }
}
