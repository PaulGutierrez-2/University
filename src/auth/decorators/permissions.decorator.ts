import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para establecer los permisos requeridos en un handler.
 * Ejemplo: @Permissions('student.read', 'student.write')
 */
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);