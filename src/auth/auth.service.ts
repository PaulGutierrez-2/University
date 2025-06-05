import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  // Inyecta Prisma para acceso a la base de datos y JwtService para generar tokens
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario.
   * - Verifica si el email ya está registrado.
   * - Hashea la contraseña.
   * - Crea el usuario y retorna el usuario y el token JWT.
   */
  async register({ email, password, name }: RegisterDto) {
    if (await this.prisma.user.findUnique({ where: { email } }))
      throw new ConflictException('El email ya está registrado');

    const user = await this.prisma.user.create({
      data: { email, password: await bcrypt.hash(password, 12), name: name ?? '' },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return {
      user,
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }

  /**
   * Inicia sesión de usuario.
   * - Busca el usuario por email.
   * - Verifica la contraseña.
   * - Retorna el usuario y el token JWT.
   */
  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Credenciales inválidas');

    return {
      user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }

  /**
   * Valida un usuario por su ID (usado por el guard JWT).
   * - Retorna los datos básicos del usuario si existe.
   */
  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return user;
  }
}