import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUniversityDTO {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    ubicacion: string;

    @IsNotEmpty()
    @IsString()
    ranking: string;

    @IsOptional()
    @IsUrl()
    imagen_url?: string;
}

export class UpdateUniversityDTO extends CreateUniversityDTO {
    @IsNotEmpty()
    @IsNumber()
    id_universidad: number;
}

export class UniversityResponseDTO {
    id_universidad: number;
    nombre: string;
    ubicacion: string;
    ranking: string;
    imagen_url?: string;
    fecha_creacion: Date;
}

export class FilterUniversitiesDTO {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    ubicacion?: string;
} 