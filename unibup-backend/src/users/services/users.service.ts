import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from "bcryptjs"
import { FilterUsersDTO, RegisterUserDTO, UserIdDTO, UserPrimaryInfoDTO, UserResponseDTO } from '../dto/users.dto';

@Injectable()
export class UsersService {
    constructor(
        @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    ) { }

    async getUsers(usersFilters: FilterUsersDTO): Promise<UserResponseDTO[] | UserPrimaryInfoDTO[]> {
        let selectFields = `
            u.id_usuario AS id,
            u.nombre AS name,
            u.correo AS email
        `;

        if (!usersFilters.no_details) {
            selectFields += `,
                u.rol AS role,
                u.fecha_creacion AS created_at
            `;
        }

        const baseQuery = `
            SELECT ${selectFields}
            FROM Usuarios u
        `;

        if (usersFilters.all_users) {
            return await this.dataSource.query(baseQuery);
        }

        const conditions = [];
        const values = [];

        if (usersFilters.role) {
            conditions.push('u.rol = ?');
            values.push(usersFilters.role);
        }

        if (conditions.length === 0) {
            return await this.dataSource.query(baseQuery);
        }

        const query = `${baseQuery} WHERE ${conditions.join(' AND ')}`;

        return await this.dataSource.query(query, values);
    }

    async registrarUsuario(userInfo: RegisterUserDTO) {
        const { nombre, correo, contrasena, confirmar_contraseña, rol } = userInfo;

        if (!(contrasena === confirmar_contraseña)) {
            throw new BadRequestException('Las contraseñas no coinciden');
        }

        const usuarioExistente = await this.dataSource.query(
            'SELECT * FROM Usuarios WHERE correo = ? LIMIT 1',
            [correo],
        );

        if (usuarioExistente.length > 0) {
            throw new BadRequestException('Este correo ya se encuentra registrado');
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        await this.dataSource.query(
            `INSERT INTO Usuarios (nombre, correo, contrasena, rol)
            VALUES (?, ?, ?, ?)`,
            [nombre, correo, hashedPassword, rol ?? 'usuario'],
        );

        return { message: 'Usuario registrado correctamente' };
    }

    async deleteUser(user: UserIdDTO) {
        const result = await this.dataSource.query(
            'DELETE FROM Usuarios WHERE id_usuario = ?',
            [user.id]
        );

        if (result.affectedRows === 0) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return { message: 'Usuario eliminado correctamente' };
    }

    async getUserById(id: number) {
        const user = await this.dataSource.query(
            `SELECT 
                id_usuario AS id,
                nombre AS name,
                correo AS email,
                rol AS role,
                fecha_creacion AS created_at
            FROM Usuarios 
            WHERE id_usuario = ?`,
            [id]
        );

        if (user.length === 0) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return user[0];
    }
}
