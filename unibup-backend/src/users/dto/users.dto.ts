import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import {
    IsBoolean,
    IsBooleanString,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsStrongPassword,
    Max,
    MaxLength,
    Min,
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


export class RegisterUserDTO extends PartialType(UserDTO) {
    @IsNotEmpty()
    @IsStrongPassword()
    contrasena: string;

    @IsNotEmpty()
    @IsStrongPassword()
    confirmar_contraseña: string;
}

export class FilterUsersDTO {
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return false;
    })
    @IsBoolean()
    all_users?: boolean;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return false;
    })
    @IsBoolean()
    students?: boolean;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return false;
    })
    @IsBoolean()
    teachers?: boolean;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return false;
    })
    @IsBoolean()
    no_details?: boolean;
}

export class UserPrimaryInfoDTO extends PartialType(UserIdDTO) {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;
}


export class UserResponseDTO extends PartialType(UserPrimaryInfoDTO) {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    role_id: string;

    @IsNotEmpty()
    @IsString()
    role_name: string;
}

export class UsersResponseDTO {
    users: UserResponseDTO[] | UserPrimaryInfoDTO[];
}