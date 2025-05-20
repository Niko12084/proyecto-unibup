import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateUniversityCareerDTO {
    @IsNotEmpty()
    @IsNumber()
    id_universidad: number;

    @IsNotEmpty()
    @IsNumber()
    id_carrera: number;

    @IsOptional()
    @IsString()
    requisitos?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    puntaje_minimo?: number;
}

export class UpdateUniversityCareerDTO extends CreateUniversityCareerDTO {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

export class UniversityCareerResponseDTO {
    id: number;
    id_universidad: number;
    id_carrera: number;
    requisitos?: string;
    puntaje_minimo?: number;
    universidad: {
        nombre: string;
        ubicacion: string;
        ranking: string;
    };
    carrera: {
        nombre: string;
        duracion: string;
        costo_estimado?: number;
    };
}

export class FilterUniversityCareersDTO {
    @IsOptional()
    @IsNumber()
    id_universidad?: number;

    @IsOptional()
    @IsNumber()
    id_carrera?: number;

    @IsOptional()
    @IsNumber()
    puntaje_minimo?: number;
} 