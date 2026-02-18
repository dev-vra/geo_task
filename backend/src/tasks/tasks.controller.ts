import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, CreateSubtaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query() filters: FilterTaskDto) {
    return this.tasksService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }

  @Put(':id/subtasks/:subtaskId/toggle')
  toggleSubtask(
    @Param('id', ParseIntPipe) id: number,
    @Param('subtaskId', ParseIntPipe) subtaskId: number,
  ) {
    return this.tasksService.toggleSubtask(id, subtaskId);
  }

  @Post(':id/subtasks')
  addSubtask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.tasksService.addSubtask(id, dto);
  }

  @Delete(':id/subtasks/:subtaskId')
  removeSubtask(
    @Param('id', ParseIntPipe) id: number,
    @Param('subtaskId', ParseIntPipe) subtaskId: number,
  ) {
    return this.tasksService.removeSubtask(id, subtaskId);
  }
}
