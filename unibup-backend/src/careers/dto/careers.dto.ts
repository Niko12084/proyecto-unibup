import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCareerDTO {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    duracion: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    costo_estimado?: number;
}

export class UpdateCareerDTO extends CreateCareerDTO {
    @IsNotEmpty()
    @IsNumber()
    id_carrera: number;
}

export class CareerResponseDTO {
    id_carrera: number;
    nombre: string;
    descripcion: string;
    duracion: string;
    costo_estimado?: number;
    fecha_creacion: Date;
}

export class FilterCareersDTO {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsNumber()
    costo_maximo?: number;
} 