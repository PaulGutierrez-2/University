import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
/**
 * Guard para proteger rutas según los roles requeridos.
 * Lee los roles requeridos del decorador @SetMetadata('roles', ...) en el handler.
 * Permite el acceso solo si el usuario tiene al menos uno de los roles requeridos.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    // Si no hay usuario o no tiene roles, deniega el acceso
    if (!user || !Array.isArray(user.roles)) return false;

    return requiredRoles.some(role => user.roles.includes(role));
  }
}