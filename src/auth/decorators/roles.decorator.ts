import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para establecer los roles requeridos en un handler.
 * Ejemplo: @Roles('admin', 'professor')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);