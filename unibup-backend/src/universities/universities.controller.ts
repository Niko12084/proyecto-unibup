import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { CreateUniversityDTO, FilterUniversitiesDTO, UpdateUniversityDTO, UniversityResponseDTO } from './dto/universities.dto';

@Controller('universities')
export class UniversitiesController {
    constructor(private readonly universitiesService: UniversitiesService) {}

    @Post()
    async createUniversity(@Body() university: CreateUniversityDTO): Promise<UniversityResponseDTO> {
        return this.universitiesService.createUniversity(university);
    }

    @Get()
    async getUniversities(@Query() filters: FilterUniversitiesDTO): Promise<UniversityResponseDTO[]> {
        return this.universitiesService.getUniversities(filters);
    }

    @Get(':id')
    async getUniversityById(@Param('id') id: number): Promise<UniversityResponseDTO> {
        return this.universitiesService.getUniversityById(id);
    }

    @Put(':id')
    async updateUniversity(
        @Param('id') id: number,
        @Body() university: UpdateUniversityDTO
    ): Promise<UniversityResponseDTO> {
        university.id_universidad = id;
        return this.universitiesService.updateUniversity(university);
    }

    @Delete(':id')
    async deleteUniversity(@Param('id') id: number): Promise<void> {
        return this.universitiesService.deleteUniversity(id);
    }
} 