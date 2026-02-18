import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  findAllCities() {
    return this.prisma.city.findMany({
      include: { _count: { select: { neighborhoods: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOneCity(id: number) {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: { neighborhoods: { orderBy: { name: 'asc' } } },
    });
    if (!city) throw new NotFoundException('Cidade não encontrada');
    return city;
  }

  createCity(dto: CreateCityDto) {
    return this.prisma.city.create({ data: dto });
  }

  findNeighborhoodsByCity(cityId: number) {
    return this.prisma.neighborhood.findMany({
      where: { cityId },
      orderBy: { name: 'asc' },
    });
  }

  createNeighborhood(dto: CreateNeighborhoodDto) {
    return this.prisma.neighborhood.create({ data: dto });
  }
}
