import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UniversityCareersService } from './university-careers.service';
import { CreateUniversityCareerDTO, FilterUniversityCareersDTO, UpdateUniversityCareerDTO, UniversityCareerResponseDTO } from './dto/university-careers.dto';

@Controller('university-careers')
export class UniversityCareersController {
    constructor(private readonly universityCareersService: UniversityCareersService) {}

    @Post()
    async createUniversityCareer(@Body() relation: CreateUniversityCareerDTO): Promise<UniversityCareerResponseDTO> {
        return this.universityCareersService.createUniversityCareer(relation);
    }

    @Get(':id')
    async getUniversityCareerById(@Param('id') id: number): Promise<UniversityCareerResponseDTO> {
        return this.universityCareersService.getUniversityCareerById(id);
    }

    @Put(':id')
    async updateUniversityCareer(
        @Param('id') id: number,
        @Body() relation: UpdateUniversityCareerDTO
    ): Promise<UniversityCareerResponseDTO> {
        relation.id = id;
        return this.universityCareersService.updateUniversityCareer(relation);
    }

    @Delete(':id')
    async deleteUniversityCareer(@Param('id') id: number): Promise<{ message: string }> {
        return this.universityCareersService.deleteUniversityCareer(id);
    }
} 