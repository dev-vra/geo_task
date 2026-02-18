import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Prisma, TaskStatus } from '@prisma/client';

const TASK_INCLUDE = {
  responsible: { select: { id: true, name: true, avatar: true, role: true } },
  sector: true,
  contract: true,
  city: true,
  neighborhood: true,
  subtasks: {
    include: {
      sector: true,
      responsible: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { id: 'asc' as const },
  },
};

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FilterTaskDto) {
    const where: Prisma.TaskWhereInput = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.type) where.type = filters.type;
    if (filters.sectorId) where.sectorId = filters.sectorId;
    if (filters.responsibleId) where.responsibleId = filters.responsibleId;
    if (filters.contractId) where.contractId = filters.contractId;
    if (filters.cityId) where.cityId = filters.cityId;
    if (filters.neighborhoodId) where.neighborhoodId = filters.neighborhoodId;

    if (filters.deadlineFrom || filters.deadlineTo) {
      where.deadline = {};
      if (filters.deadlineFrom) where.deadline.gte = new Date(filters.deadlineFrom);
      if (filters.deadlineTo) where.deadline.lte = new Date(filters.deadlineTo);
    }

    return this.prisma.task.findMany({
      where,
      include: TASK_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: TASK_INCLUDE,
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  async create(dto: CreateTaskDto) {
    const { subtasks, deadline, ...data } = dto;
    return this.prisma.task.create({
      data: {
        ...data,
        deadline: deadline ? new Date(deadline) : null,
        subtasks: subtasks?.length
          ? { create: subtasks.map((s) => ({ title: s.title, description: s.description, sectorId: s.sectorId, responsibleId: s.responsibleId })) }
          : undefined,
      },
      include: TASK_INCLUDE,
    });
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.findOne(id);
    const { subtasks, deadline, status, ...data } = dto;
    const updateData: any = { ...data };

    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;

    if (status) {
      updateData.status = status;
      const now = new Date();
      if (status === TaskStatus.EM_ANDAMENTO) updateData.startedAt = now;
      if (status === TaskStatus.PAUSADO) updateData.pausedAt = now;
      if (status === TaskStatus.CONCLUIDO) updateData.completedAt = now;
    }

    return this.prisma.task.update({
      where: { id },
      data: updateData,
      include: TASK_INCLUDE,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.task.delete({ where: { id } });
  }

  async toggleSubtask(taskId: number, subtaskId: number) {
    const subtask = await this.prisma.subtask.findFirst({
      where: { id: subtaskId, taskId },
    });
    if (!subtask) throw new NotFoundException('Subtarefa não encontrada');
    return this.prisma.subtask.update({
      where: { id: subtaskId },
      data: { done: !subtask.done },
    });
  }

  async addSubtask(taskId: number, data: { title: string; description?: string; sectorId?: number; responsibleId?: number }) {
    await this.findOne(taskId);
    return this.prisma.subtask.create({
      data: { ...data, taskId },
    });
  }

  async removeSubtask(taskId: number, subtaskId: number) {
    const subtask = await this.prisma.subtask.findFirst({
      where: { id: subtaskId, taskId },
    });
    if (!subtask) throw new NotFoundException('Subtarefa não encontrada');
    return this.prisma.subtask.delete({ where: { id: subtaskId } });
  }
}
