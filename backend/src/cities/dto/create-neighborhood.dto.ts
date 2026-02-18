import { IsString, IsInt } from 'class-validator';

export class CreateNeighborhoodDto {
  @IsString()
  name: string;

  @IsInt()
  cityId: number;
}
