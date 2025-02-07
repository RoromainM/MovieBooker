import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 12345 })
  filmId: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({ example: '2023-12-31T10:00:00Z' })
  date: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({ example: '2023-12-31T12:00:00Z' })
  endDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 67890 })
  userId: number;
}