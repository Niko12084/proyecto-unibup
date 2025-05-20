import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import appConfigurations from 'src/config/app.config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from '../interfaces/payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(appConfigurations.KEY)
    private readonly configService: ConfigType<typeof appConfigurations>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.secret,
    });
  }

  validate(payload: Payload) {
    const { user } = payload;

    if (!user || !user.rol_id) {
      throw new UnauthorizedException('Token inválido o rol no encontrado');
    }

    return user;
  }
}
