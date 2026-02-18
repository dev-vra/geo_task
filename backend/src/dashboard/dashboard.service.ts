import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const tasks = await this.prisma.task.findMany({
      include: { sector: true, responsible: true, subtasks: true },
    });

    const total = tasks.length;
    const byStatus = {
      A_FAZER: tasks.filter((t) => t.status === TaskStatus.A_FAZER).length,
      EM_ANDAMENTO: tasks.filter((t) => t.status === TaskStatus.EM_ANDAMENTO).length,
      PAUSADO: tasks.filter((t) => t.status === TaskStatus.PAUSADO).length,
      CONCLUIDO: tasks.filter((t) => t.status === TaskStatus.CONCLUIDO).length,
    };

    const concluded = tasks.filter((t) => t.status === TaskStatus.CONCLUIDO);
    const avgTime = concluded.length
      ? Math.round(concluded.reduce((a, t) => a + t.timeSpent, 0) / concluded.length)
      : 0;

    const byPriority = {
      ALTA: tasks.filter((t) => t.priority === 'ALTA').length,
      MEDIA: tasks.filter((t) => t.priority === 'MEDIA').length,
      BAIXA: tasks.filter((t) => t.priority === 'BAIXA').length,
    };

    const byType: Record<string, number> = {};
    tasks.forEach((t) => {
      byType[t.type] = (byType[t.type] || 0) + 1;
    });

    const bySector: Record<string, number> = {};
    tasks.forEach((t) => {
      const name = t.sector?.name || 'Sem setor';
      bySector[name] = (bySector[name] || 0) + 1;
    });

    const completedBySector: Record<string, number> = {};
    concluded.forEach((t) => {
      const name = t.sector?.name || 'Sem setor';
      completedBySector[name] = (completedBySector[name] || 0) + 1;
    });

    const completedByUser: Record<string, number> = {};
    concluded.forEach((t) => {
      const name = t.responsible?.name || 'Sem responsável';
      completedByUser[name] = (completedByUser[name] || 0) + 1;
    });

    const upcoming = tasks
      .filter((t) => t.status !== TaskStatus.CONCLUIDO && t.deadline)
      .sort((a, b) => (a.deadline!.getTime() - b.deadline!.getTime()))
      .slice(0, 10);

    return {
      total,
      byStatus,
      avgTime,
      byPriority,
      byType,
      bySector,
      completedBySector,
      completedByUser,
      upcoming,
    };
  }
}
