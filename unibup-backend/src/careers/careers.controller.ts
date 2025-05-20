import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CareersService } from './careers.service';
import { CreateCareerDTO, FilterCareersDTO, UpdateCareerDTO, CareerResponseDTO } from './dto/careers.dto';

@Controller('careers')
export class CareersController {
    constructor(private readonly careersService: CareersService) {}

    @Post()
    async createCareer(@Body() career: CreateCareerDTO): Promise<CareerResponseDTO> {
        return this.careersService.createCareer(career);
    }

    @Get()
    async getCareers(@Query() filters: FilterCareersDTO): Promise<CareerResponseDTO[]> {
        return this.careersService.getCareers(filters);
    }

    @Get(':id')
    async getCareerById(@Param('id') id: number): Promise<CareerResponseDTO> {
        return this.careersService.getCareerById(id);
    }

    @Put(':id')
    async updateCareer(
        @Param('id') id: number,
        @Body() career: UpdateCareerDTO
    ): Promise<CareerResponseDTO> {
        career.id_carrera = id;
        return this.careersService.updateCareer(career);
    }

    @Delete(':id')
    async deleteCareer(@Param('id') id: number): Promise<void> {
        return this.careersService.deleteCareer(id);
    }
} 