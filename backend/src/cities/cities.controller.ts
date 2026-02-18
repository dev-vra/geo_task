import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';

@ApiTags('cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll() {
    return this.citiesService.findAllCities();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.findOneCity(id);
  }

  @Post()
  create(@Body() dto: CreateCityDto) {
    return this.citiesService.createCity(dto);
  }

  @Get(':id/neighborhoods')
  findNeighborhoods(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.findNeighborhoodsByCity(id);
  }

  @Post(':id/neighborhoods')
  createNeighborhood(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateNeighborhoodDto) {
    dto.cityId = id;
    return this.citiesService.createNeighborhood(dto);
  }
}
