import { Module } from '@nestjs/common';
import { UniversityCareersService } from './university-careers.service';
import { UniversityCareersController } from './university-careers.controller';
import { UniversitiesModule } from '../universities/universities.module';
import { CareersModule } from '../careers/careers.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [UniversitiesModule, CareersModule, DatabaseModule],
  controllers: [UniversityCareersController],
  providers: [UniversityCareersService],
  exports: [UniversityCareersService]
})
export class UniversityCareersModule {} 