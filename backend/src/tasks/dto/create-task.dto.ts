import { IsString, IsEnum, IsOptional, IsInt, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus, Priority, TaskType } from '@prisma/client';

export class CreateSubtaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  sectorId?: number;

  @IsInt()
  @IsOptional()
  responsibleId?: number;
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsEnum(TaskType)
  type: TaskType;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  quadra?: string;

  @IsString()
  @IsOptional()
  lote?: string;

  @IsInt()
  @IsOptional()
  responsibleId?: number;

  @IsInt()
  @IsOptional()
  sectorId?: number;

  @IsInt()
  @IsOptional()
  contractId?: number;

  @IsInt()
  @IsOptional()
  cityId?: number;

  @IsInt()
  @IsOptional()
  neighborhoodId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubtaskDto)
  @IsOptional()
  subtasks?: CreateSubtaskDto[];
}
