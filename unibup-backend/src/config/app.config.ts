import { registerAs } from '@nestjs/config';
import { IAppConfiguration } from './interfaces/config.interface';

const appConfigurations = registerAs(
  'configEnvs',
  (): IAppConfiguration => ({
    dbHost: process.env.DB_HOST,
    dbPort: Number(process.env.DB_PORT),
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    jwtSecret: process.env.JWT_SECRET,
    secret: process.env.SECRET,

  }),
);

export default appConfigurations;
