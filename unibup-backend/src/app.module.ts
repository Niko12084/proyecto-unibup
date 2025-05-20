import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import appConfigurations from './config/app.config';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UniversitiesModule } from './universities/universities.module';
import { CareersModule } from './careers/careers.module';
import { UniversityCareersModule } from './university-careers/university-careers.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfigurations],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    UniversitiesModule,
    CareersModule,
    UniversityCareersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AppModule { }
