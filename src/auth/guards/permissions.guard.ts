import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
/**
 * Guard para proteger rutas según los permisos requeridos.
 * Lee los permisos requeridos del decorador @SetMetadata('permissions', ...) en el handler.
 * Permite el acceso solo si el usuario tiene todos los permisos requeridos.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    // Si no hay usuario o no tiene permisos, deniega el acceso
    if (!user || !Array.isArray(user.permissions)) return false;

    return requiredPermissions.every(permission =>
      user.permissions.includes(permission)
    );
  }
}