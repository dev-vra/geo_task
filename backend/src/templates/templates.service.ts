import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';

const TEMPLATE_INCLUDE = {
  templateTasks: {
    include: { subtasks: { orderBy: { order: 'asc' as const } } },
    orderBy: { order: 'asc' as const },
  },
};

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.template.findMany({
      include: TEMPLATE_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const template = await this.prisma.template.findUnique({
      where: { id },
      include: TEMPLATE_INCLUDE,
    });
    if (!template) throw new NotFoundException('Template não encontrado');
    return template;
  }

  async create(dto: CreateTemplateDto) {
    return this.prisma.template.create({
      data: {
        name: dto.name,
        sector: dto.sector,
        templateTasks: dto.tasks?.length
          ? {
              create: dto.tasks.map((t, i) => ({
                title: t.title,
                order: t.order ?? i + 1,
                subtasks: t.subtasks?.length
                  ? { create: t.subtasks.map((s, j) => ({ title: s.title, order: s.order ?? j + 1 })) }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: TEMPLATE_INCLUDE,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.template.delete({ where: { id } });
  }
}
