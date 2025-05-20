import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { LoginInterface, TokenResponseInterface } from "../interfaces/auth.interface";

export class LoginDTO implements LoginInterface {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    correo: string;

    @IsNotEmpty()
    @IsString()
    contrasena: string;
}

export class TokenResponseDTO implements TokenResponseInterface {
    access_token: string;
}