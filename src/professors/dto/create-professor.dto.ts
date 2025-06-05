export class CreateProfessorDto {
  userId: number;
  code: string;
  subjectIds?: number[];
  degreeIds?: number[];
}
