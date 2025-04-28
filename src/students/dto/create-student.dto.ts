// src/students/dto/create-student.dto.ts
export class CreateStudentDto {
    name: string;
    degreeIds?: number[];   // opcional, si quieres asignarlo a carreras
    subjectIds?: number[];  // opcional, si quieres asignarle materias
  }
  