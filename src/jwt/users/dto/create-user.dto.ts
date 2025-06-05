import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsBoolean()
  isActive?: boolean;
}
