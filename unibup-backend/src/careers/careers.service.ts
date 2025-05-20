import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateCareerDTO, FilterCareersDTO, UpdateCareerDTO, CareerResponseDTO } from './dto/careers.dto';

@Injectable()
export class CareersService {
    constructor(
        @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    ) {}

    async createCareer(career: CreateCareerDTO): Promise<CareerResponseDTO> {
        const result = await this.dataSource.query(
            `INSERT INTO Carreras (nombre, descripcion, duracion, costo_estimado)
            VALUES (?, ?, ?, ?)`,
            [career.nombre, career.descripcion, career.duracion, career.costo_estimado]
        );

        return this.getCareerById(result.insertId);
    }

    async getCareers(filters: FilterCareersDTO): Promise<CareerResponseDTO[]> {
        let query = `
            SELECT 
                id_carrera,
                nombre,
                descripcion,
                duracion,
                costo_estimado,
                fecha_creacion
            FROM Carreras
            WHERE 1=1
        `;
        const values = [];

        if (filters.search) {
            query += ` AND (nombre LIKE ? OR descripcion LIKE ?)`;
            values.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        if (filters.costo_maximo) {
            query += ` AND costo_estimado <= ?`;
            values.push(filters.costo_maximo);
        }

        return await this.dataSource.query(query, values);
    }

    async getCareerById(id: number): Promise<CareerResponseDTO> {
        const careers = await this.dataSource.query(
            `SELECT 
                id_carrera,
                nombre,
                descripcion,
                duracion,
                costo_estimado,
                fecha_creacion
            FROM Carreras
            WHERE id_carrera = ?`,
            [id]
        );

        if (!careers.length) {
            throw new NotFoundException('Carrera no encontrada');
        }

        return careers[0];
    }

    async updateCareer(career: UpdateCareerDTO): Promise<CareerResponseDTO> {
        const existingCareer = await this.getCareerById(career.id_carrera);

        await this.dataSource.query(
            `UPDATE Carreras 
            SET nombre = ?, descripcion = ?, duracion = ?, costo_estimado = ?
            WHERE id_carrera = ?`,
            [
                career.nombre,
                career.descripcion,
                career.duracion,
                career.costo_estimado,
                career.id_carrera
            ]
        );

        return this.getCareerById(career.id_carrera);
    }

    async deleteCareer(id: number): Promise<void> {
        const result = await this.dataSource.query(
            'DELETE FROM Carreras WHERE id_carrera = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            throw new NotFoundException('Carrera no encontrada');
        }
    }
} 