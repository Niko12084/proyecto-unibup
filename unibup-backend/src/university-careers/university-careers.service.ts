import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUniversityCareerDTO, FilterUniversityCareersDTO, UpdateUniversityCareerDTO, UniversityCareerResponseDTO } from './dto/university-careers.dto';
import { UniversitiesService } from '../universities/universities.service';
import { CareersService } from '../careers/careers.service';

@Injectable()
export class UniversityCareersService {
    constructor(
        @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
        private readonly universitiesService: UniversitiesService,
        private readonly careersService: CareersService,
    ) {}

    async createUniversityCareer(relation: CreateUniversityCareerDTO): Promise<UniversityCareerResponseDTO> {
        // Verify that both university and career exist
        await this.universitiesService.getUniversityById(relation.id_universidad);
        await this.careersService.getCareerById(relation.id_carrera);

        // Check if the relation already exists
        const existingRelation = await this.dataSource.query(
            'SELECT * FROM UniversidadCarrera WHERE id_universidad = ? AND id_carrera = ?',
            [relation.id_universidad, relation.id_carrera]
        );

        if (existingRelation.length > 0) {
            throw new BadRequestException('Esta relación universidad-carrera ya existe');
        }

        const result = await this.dataSource.query(
            `INSERT INTO UniversidadCarrera (id_universidad, id_carrera, requisitos, puntaje_minimo)
            VALUES (?, ?, ?, ?)`,
            [
                relation.id_universidad,
                relation.id_carrera,
                relation.requisitos,
                relation.puntaje_minimo
            ]
        );

        return this.getUniversityCareerById(result.insertId);
    }

    async getUniversityCareers(filters: FilterUniversityCareersDTO): Promise<UniversityCareerResponseDTO[]> {
        let query = `
            SELECT 
                uc.id,
                uc.id_universidad,
                uc.id_carrera,
                uc.requisitos,
                uc.puntaje_minimo,
                u.nombre AS universidad_nombre,
                u.ubicacion AS universidad_ubicacion,
                u.ranking AS universidad_ranking,
                c.nombre AS carrera_nombre,
                c.duracion AS carrera_duracion,
                c.costo_estimado AS carrera_costo_estimado
            FROM UniversidadCarrera uc
            JOIN Universidades u ON uc.id_universidad = u.id_universidad
            JOIN Carreras c ON uc.id_carrera = c.id_carrera
            WHERE 1=1
        `;
        const values = [];

        if (filters.id_universidad) {
            query += ` AND uc.id_universidad = ?`;
            values.push(filters.id_universidad);
        }

        if (filters.id_carrera) {
            query += ` AND uc.id_carrera = ?`;
            values.push(filters.id_carrera);
        }

        if (filters.puntaje_minimo) {
            query += ` AND uc.puntaje_minimo >= ?`;
            values.push(filters.puntaje_minimo);
        }

        const results = await this.dataSource.query(query, values);

        return results.map(result => ({
            id: result.id,
            id_universidad: result.id_universidad,
            id_carrera: result.id_carrera,
            requisitos: result.requisitos,
            puntaje_minimo: result.puntaje_minimo,
            universidad: {
                nombre: result.universidad_nombre,
                ubicacion: result.universidad_ubicacion,
                ranking: result.universidad_ranking
            },
            carrera: {
                nombre: result.carrera_nombre,
                duracion: result.carrera_duracion,
                costo_estimado: result.carrera_costo_estimado
            }
        }));
    }

    async getUniversityCareerById(id: number): Promise<UniversityCareerResponseDTO> {
        const relations = await this.dataSource.query(
            `SELECT 
                uc.id,
                uc.id_universidad,
                uc.id_carrera,
                uc.requisitos,
                uc.puntaje_minimo,
                u.nombre AS universidad_nombre,
                u.ubicacion AS universidad_ubicacion,
                u.ranking AS universidad_ranking,
                c.nombre AS carrera_nombre,
                c.duracion AS carrera_duracion,
                c.costo_estimado AS carrera_costo_estimado
            FROM UniversidadCarrera uc
            JOIN Universidades u ON uc.id_universidad = u.id_universidad
            JOIN Carreras c ON uc.id_carrera = c.id_carrera
            WHERE uc.id = ?`,
            [id]
        );

        if (!relations.length) {
            throw new NotFoundException('Relación universidad-carrera no encontrada');
        }

        const result = relations[0];
        return {
            id: result.id,
            id_universidad: result.id_universidad,
            id_carrera: result.id_carrera,
            requisitos: result.requisitos,
            puntaje_minimo: result.puntaje_minimo,
            universidad: {
                nombre: result.universidad_nombre,
                ubicacion: result.universidad_ubicacion,
                ranking: result.universidad_ranking
            },
            carrera: {
                nombre: result.carrera_nombre,
                duracion: result.carrera_duracion,
                costo_estimado: result.carrera_costo_estimado
            }
        };
    }

    async updateUniversityCareer(relation: UpdateUniversityCareerDTO): Promise<UniversityCareerResponseDTO> {
        const existingRelation = await this.getUniversityCareerById(relation.id);

        // Verify that both university and career exist
        await this.universitiesService.getUniversityById(relation.id_universidad);
        await this.careersService.getCareerById(relation.id_carrera);

        await this.dataSource.query(
            `UPDATE UniversidadCarrera 
            SET id_universidad = ?, id_carrera = ?, requisitos = ?, puntaje_minimo = ?
            WHERE id = ?`,
            [
                relation.id_universidad,
                relation.id_carrera,
                relation.requisitos,
                relation.puntaje_minimo,
                relation.id
            ]
        );

        return this.getUniversityCareerById(relation.id);
    }

    async deleteUniversityCareer(id: number): Promise<{ message: string }> {
        const result = await this.dataSource.query(
            'DELETE FROM UniversidadCarrera WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            throw new NotFoundException('Relación universidad-carrera no encontrada');
        }

        return { message: 'Relación universidad-carrera eliminada correctamente' };
    }
} 