import { Module } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [UniversitiesController],
    providers: [UniversitiesService],
    exports: [UniversitiesService]
})
export class UniversitiesModule { } 