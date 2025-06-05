export class CreateSubjectDto {
  name: string;
  code: string;
  degreeId: number;
  professorIds?: number[];
  studentIds?: number[];
}
