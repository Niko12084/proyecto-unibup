import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'DATA_SOURCE',
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const maxRetries = 10;
                const retryDelay = 6000;

                let retries = 0;
                while (retries < maxRetries) {
                    try {
                        const dataSource = new DataSource({
                            type: 'mysql',
                            host: configService.get<string>('DB_HOST'),
                            port: configService.get<number>('DB_PORT'),
                            username: configService.get<string>('DB_USER'),
                            password: configService.get<string>('DB_PASSWORD'),
                            database: configService.get<string>('DB_NAME'),
                            synchronize: false,
                        });

                        return await dataSource.initialize();
                    } catch (error) {
                        retries++;
                        console.error(
                            `Error connecting to the database. Retry ${retries}/${maxRetries}...`,
                            error.message,
                        );
                        if (retries >= maxRetries) {
                            throw new Error('Max retries reached. Could not connect to the database.');
                        }
                        await new Promise((resolve) => setTimeout(resolve, retryDelay));
                    }
                }
            },
        },
    ],
    exports: ['DATA_SOURCE'],
})
export class DatabaseModule {}
