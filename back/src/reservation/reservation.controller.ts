import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('reservations')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateReservationDto })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reservation by ID' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reservation by ID' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    const result = await this.reservationService.update(+id, updateReservationDto);
    if (!result) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reservation by ID' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async remove(@Param('id') id: string) {
    const result = await this.reservationService.remove(+id);
    if (!result) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return result;
  }
}
