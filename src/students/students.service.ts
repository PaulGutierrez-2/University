import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {

  constructor( private prisma: PrismaService) {}

  // src/students/students.service.ts
  create(createStudentDto: CreateStudentDto) {
    const { name, degreeIds, subjectIds } = createStudentDto;
  
    return this.prisma.student.create({
      data: {
        name,
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

  getSubjectAndDegreeOfStudent(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
      include: { subjects: true, degrees: true },
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, data: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return this.prisma.student.delete({where: { id }})
  }
}
