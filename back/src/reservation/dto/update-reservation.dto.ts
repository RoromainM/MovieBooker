import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  filmId?: number;
}
