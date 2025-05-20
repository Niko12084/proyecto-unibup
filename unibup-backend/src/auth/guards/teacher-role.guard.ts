import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TeacherRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const { user } = request;

        if (!user) {
            throw new ForbiddenException('No se encontró información del usuario');
        }

        if (user.rol_id !== 1) {
            throw new ForbiddenException('Acceso denegado: No tienes permisos suficientes');
        }

        return true;
    }
}
