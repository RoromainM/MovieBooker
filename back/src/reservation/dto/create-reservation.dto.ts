import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  @ApiProperty({ example: '2023-12-31T10:00:00Z' })
  date: string;

  @IsInt()
  @ApiProperty({ example: 12345 })
  movieId: number;

  @IsString()
  time: string;
}