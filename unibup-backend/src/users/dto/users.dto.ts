import { PartialType } from "@nestjs/mapped-types";
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString, Max, Min,
    MinLength
} from "class-validator";

export class UserIdDTO {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(1000000)
    @Max(99999999999)
    id: number;
}

export class UserDTO extends PartialType(UserIdDTO) {
    @IsNotEmpty()
    @MinLength(1)
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    apellido: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    correo: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    rol_id?: number;
}

export class RegisterUserDTO {
    nombre: string;
    correo: string;
    contrasena: string;
    confirmar_contraseña: string;
    rol?: 'admin' | 'usuario';
}

export class FilterUsersDTO {
    all_users?: boolean;
    no_details?: boolean;
    role?: 'admin' | 'usuario';
}

export class UserPrimaryInfoDTO {
    id: number;
    name: string;
    email: string;
}

export class UserResponseDTO extends UserPrimaryInfoDTO {
    role: 'admin' | 'usuario';
    created_at: Date;
}

export class UsersResponseDTO {
    users: UserResponseDTO[] | UserPrimaryInfoDTO[];
}