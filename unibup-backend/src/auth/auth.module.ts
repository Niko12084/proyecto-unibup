import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfigurations from 'src/config/app.config';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      inject: [appConfigurations.KEY],
      useFactory(configEnvs: ConfigType<typeof appConfigurations>) {
        return {
          secret: configEnvs.secret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    DatabaseModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
