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
          u.id,
          u.nombre,
          u.apellido,
          u.correo,
          u.contrasena,
          u.rol_id,
          r.nombre AS rol

        FROM usuarios u 
          JOIN roles r ON u.rol_id = r.id

        WHERE correo = ? LIMIT 1
      `,
      [correo],
    );

    if (!usuario.length) throw new UnauthorizedException('Usuario no encontrado');

    const user = usuario[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    return user;
  }


  async login(body: LoginDTO): Promise<TokenResponseDTO> {

    const user = await this.validateUser(body);

    const payload = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol_id: user.rol_id,
      rol: user.rol,
    };
    const token = this.jwtService.sign({ user: payload });

    return { access_token: token };
  }
}
