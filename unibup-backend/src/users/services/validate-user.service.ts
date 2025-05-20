import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserDTO } from '../dto/users.dto';


@Injectable()
export class ValidateUsersService {
    constructor(
        @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    ) { }

    async validateUser(user_id: number) {
        const query = `SELECT * FROM usuarios WHERE id = ?`;

        const user: UserDTO[] = await this.dataSource.query(query, [user_id]);

        if (user.length === 0) throw new NotFoundException('Usuario no encontrado');

        return user[0];
    }
}
