import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  DegreeStatistics, 
  ProfessorSummary, 
  StudentSummary, 
  SubjectDetails 
} from '../types/view-types';

@Injectable()
export class AcademicStatsService {
  constructor(private prisma: PrismaService) {}

  async getDegreeStatistics(): Promise<DegreeStatistics[]> {
    const degrees = await this.prisma.$queryRaw<DegreeStatistics[]>`
      SELECT * FROM degree_statistics 
      WHERE "isActive" = true
      ORDER BY degree_name ASC
    `;
    return degrees;
  }

  async getDegreeById(degreeId: number): Promise<DegreeStatistics | null> {
    const degrees = await this.prisma.$queryRaw<DegreeStatistics[]>`
      SELECT * FROM degree_statistics 
      WHERE degree_id = ${degreeId}
    `;
    return degrees[0] || null;
  }

  async getProfessorSummary(): Promise<ProfessorSummary[]> {
    const professors = await this.prisma.$queryRaw<ProfessorSummary[]>`
      SELECT * FROM professor_summary 
      WHERE "isActive" = true
      ORDER BY professor_name ASC
    `;
    return professors;
  }

  async getTopProfessorsBySubjects(limit: number = 10): Promise<ProfessorSummary[]> {
    const professors = await this.prisma.$queryRaw<ProfessorSummary[]>`
      SELECT * FROM professor_summary 
      WHERE "isActive" = true
      ORDER BY total_subjects DESC, professor_name ASC
      LIMIT ${limit}
    `;
    return professors;
  }

  async getStudentSummary(): Promise<StudentSummary[]> {
    const students = await this.prisma.$queryRaw<StudentSummary[]>`
      SELECT * FROM student_summary 
      WHERE "isActive" = true
      ORDER BY student_name ASC
    `;
    return students;
  }

  async getStudentsByDegree(degreeName: string): Promise<StudentSummary[]> {
    const students = await this.prisma.$queryRaw<StudentSummary[]>`
      SELECT * FROM student_summary 
      WHERE degree_names ILIKE ${`%${degreeName}%`}
      AND "isActive" = true
      ORDER BY student_name ASC
    `;
    return students;
  }

  async getSubjectDetails(): Promise<SubjectDetails[]> {
    const subjects = await this.prisma.$queryRaw<SubjectDetails[]>`
      SELECT * FROM subject_details 
      WHERE "isActive" = true
      ORDER BY subject_name ASC
    `;
    return subjects;
  }

  async getSubjectsByDegree(degreeId: number): Promise<SubjectDetails[]> {
    const subjects = await this.prisma.$queryRaw<SubjectDetails[]>`
      SELECT * FROM subject_details 
      WHERE degree_id = ${degreeId} AND "isActive" = true
      ORDER BY subject_name ASC
    `;
    return subjects;
  }

  async getSubjectsWithMostStudents(limit: number = 10): Promise<SubjectDetails[]> {
    const subjects = await this.prisma.$queryRaw<SubjectDetails[]>`
      SELECT * FROM subject_details 
      WHERE "isActive" = true
      ORDER BY total_students DESC, subject_name ASC
      LIMIT ${limit}
    `;
    return subjects;
  }
}