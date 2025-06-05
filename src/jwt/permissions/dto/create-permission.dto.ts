import { IsString, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsString()
  resource: string; // ej: "student", "professor", "degree", "subject"

  @IsString()
  action: string; // ej: "read", "write", "delete", "manage"

  @IsOptional()
  @IsString()
  description?: string;
}
