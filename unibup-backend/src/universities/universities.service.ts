import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUniversityDTO, FilterUniversitiesDTO, UpdateUniversityDTO, UniversityResponseDTO } from './dto/universities.dto';

@Injectable()
export class UniversitiesService {
    constructor(
        @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    ) {}

    async createUniversity(university: CreateUniversityDTO): Promise<UniversityResponseDTO> {
        const result = await this.dataSource.query(
            `INSERT INTO Universidades (nombre, ubicacion, ranking, imagen_url)
            VALUES (?, ?, ?, ?)`,
            [university.nombre, university.ubicacion, university.ranking, university.imagen_url]
        );

        return this.getUniversityById(result.insertId);
    }

    async getUniversities(filters: FilterUniversitiesDTO): Promise<UniversityResponseDTO[]> {
        let query = `
            SELECT 
                id_universidad,
                nombre,
                ubicacion,
                ranking,
                imagen_url,
                fecha_creacion
            FROM Universidades
            WHERE 1=1
        `;
        const values = [];

        if (filters.search) {
            query += ` AND (nombre LIKE ? OR ubicacion LIKE ?)`;
            values.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        if (filters.ubicacion) {
            query += ` AND ubicacion = ?`;
            values.push(filters.ubicacion);
        }

        return await this.dataSource.query(query, values);
    }

    async getUniversityById(id: number): Promise<UniversityResponseDTO> {
        const universities = await this.dataSource.query(
            `SELECT 
                id_universidad,
                nombre,
                ubicacion,
                ranking,
                imagen_url,
                fecha_creacion
            FROM Universidades
            WHERE id_universidad = ?`,
            [id]
        );

        if (!universities.length) {
            throw new NotFoundException('Universidad no encontrada');
        }

        return universities[0];
    }

    async updateUniversity(university: UpdateUniversityDTO): Promise<UniversityResponseDTO> {
        const existingUniversity = await this.getUniversityById(university.id_universidad);

        await this.dataSource.query(
            `UPDATE Universidades 
            SET nombre = ?, ubicacion = ?, ranking = ?, imagen_url = ?
            WHERE id_universidad = ?`,
            [
                university.nombre,
                university.ubicacion,
                university.ranking,
                university.imagen_url,
                university.id_universidad
            ]
        );

        return this.getUniversityById(university.id_universidad);
    }

    async deleteUniversity(id: number): Promise<{ message: string }> {
        const result = await this.dataSource.query(
            'DELETE FROM Universidades WHERE id_universidad = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            throw new NotFoundException('Universidad no encontrada');
        }

        return { message: 'Universidad eliminada correctamente' };
    }
} 