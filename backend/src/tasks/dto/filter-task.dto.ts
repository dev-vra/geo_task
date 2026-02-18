import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus, Priority, TaskType } from '@prisma/client';

export class FilterTaskDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  sectorId?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  responsibleId?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  contractId?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  cityId?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  neighborhoodId?: number;

  @IsString()
  @IsOptional()
  deadlineFrom?: string;

  @IsString()
  @IsOptional()
  deadlineTo?: string;
}
