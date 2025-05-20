import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDTO, TokenResponseDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
  ) { }

  async validateUser(body: LoginDTO) {
    const { correo, contrasena } = body;

    const usuario = await this.dataSource.query(`
        SELECT 
          id_usuario,
          nombre,
          correo,
          contrasena,
          rol,
          fecha_creacion
        FROM Usuarios
        WHERE correo = ? LIMIT 1
      `,
      [correo],
    );

    if (!usuario.length) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const user = usuario[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return user;
  }

  async login(body: LoginDTO): Promise<TokenResponseDTO> {
    const user = await this.validateUser(body);

    const payload = {
      id: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      fecha_creacion: user.fecha_creacion
    };

    const token = this.jwtService.sign({ user: payload });

    return { access_token: token };
  }
}
