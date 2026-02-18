import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectorDto } from './dto/create-sector.dto';

@Injectable()
export class SectorsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sector.findMany({
      include: { _count: { select: { users: true, tasks: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const sector = await this.prisma.sector.findUnique({
      where: { id },
      include: { users: true },
    });
    if (!sector) throw new NotFoundException('Setor não encontrado');
    return sector;
  }

  create(dto: CreateSectorDto) {
    return this.prisma.sector.create({ data: dto });
  }

  async update(id: number, dto: CreateSectorDto) {
    await this.findOne(id);
    return this.prisma.sector.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sector.delete({ where: { id } });
  }
}
