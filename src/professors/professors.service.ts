import { Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfessorsService {

  constructor( private prisma: PrismaService) {}

  create(createProfessorDto: CreateProfessorDto) {
    const { name, subjectIds, degreeIds } = createProfessorDto;
  
    return this.prisma.professor.create({
      data: {
        name,
        subjects: subjectIds?.length
          ? { connect: subjectIds.map(id => ({ id })) }
          : undefined,
        professors: degreeIds?.length
          ? { connect: degreeIds.map(id => ({ id })) }
          : undefined,
      },
    });
  }  

  findAll() {
    return this.prisma.professor.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} professor`;
  }

  update(id: number, updateProfessorDto: UpdateProfessorDto) {
    return `This action updates a #${id} professor`;
  }

  remove(id: number) {
    return `This action removes a #${id} professor`;
  }
}
