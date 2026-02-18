import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.contract.findMany({
      include: { _count: { select: { tasks: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { tasks: { include: { city: true, neighborhood: true } } },
    });
    if (!contract) throw new NotFoundException('Contrato não encontrado');
    return contract;
  }

  create(dto: CreateContractDto) {
    return this.prisma.contract.create({ data: dto });
  }

  async update(id: number, dto: CreateContractDto) {
    await this.findOne(id);
    return this.prisma.contract.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.contract.delete({ where: { id } });
  }
}
