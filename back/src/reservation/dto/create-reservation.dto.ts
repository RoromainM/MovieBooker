import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: '2023-12-31T10:00:00Z' })
  date: Date;

  @ApiProperty({ example: '2023-12-31T12:00:00Z' })
  endDate: Date;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 12345 })
  filmId: number;
}