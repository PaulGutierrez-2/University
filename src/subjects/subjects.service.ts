import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectsService {

  constructor( private prisma:PrismaService) {}
  
  create(createSubjectDto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: {
        name: createSubjectDto.name,
        degree: {
          connect: { id: createSubjectDto.degreeId },
        },
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
    }).then(subject => subject?.professors)
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
