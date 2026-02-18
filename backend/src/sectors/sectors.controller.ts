import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SectorsService } from './sectors.service';
import { CreateSectorDto } from './dto/create-sector.dto';

@ApiTags('sectors')
@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Get()
  findAll() {
    return this.sectorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sectorsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSectorDto) {
    return this.sectorsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateSectorDto) {
    return this.sectorsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sectorsService.remove(id);
  }
}
