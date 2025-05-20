import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail()
    correo: string;

    @IsNotEmpty()
    @IsString()
    contrasena: string;
}

export class TokenResponseDTO {
    access_token: string;
}

export class JwtPayload {
    user: {
        id: number;
        nombre: string;
        correo: string;
        rol: 'admin' | 'usuario';
        fecha_creacion: Date;
    };
}