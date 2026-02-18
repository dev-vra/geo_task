import { IsString, IsEmail, IsEnum, IsOptional, IsInt } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsInt()
  @IsOptional()
  sectorId?: number;
}
