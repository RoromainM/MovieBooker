import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: '2023-12-31T23:59:59Z' })
  date: Date;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 12345 })
  filmId: number;
}
