import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiProperty({ example: '2023-12-31T23:59:59Z', required: false })
  date?: string;

  @ApiProperty({ example: 1, required: false })
  userId?: number;

  @ApiProperty({ example: 12345, required: false })
  filmId?: number;
}
