import { IsString, IsArray, ValidateNested, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class TemplateSubtaskDto {
  @IsString()
  title: string;

  @IsInt()
  @IsOptional()
  order?: number;
}

export class TemplateTaskDto {
  @IsString()
  title: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateSubtaskDto)
  @IsOptional()
  subtasks?: TemplateSubtaskDto[];
}

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsString()
  sector: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateTaskDto)
  @IsOptional()
  tasks?: TemplateTaskDto[];
}
