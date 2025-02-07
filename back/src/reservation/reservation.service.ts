import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    await this.checkForUserConflicts(createReservationDto.date, createReservationDto.endDate, createReservationDto.filmId, createReservationDto.userId);
    return this.prisma.reservation.create({
      data: {
        filmId: createReservationDto.filmId,
        date: new Date(createReservationDto.date),
        endDate: new Date(createReservationDto.endDate),
        userId: createReservationDto.userId,
      },
    });
  }

  async findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    if (updateReservationDto.date && updateReservationDto.endDate && updateReservationDto.filmId && updateReservationDto.userId) {
      await this.checkForUserConflicts(updateReservationDto.date, updateReservationDto.endDate, updateReservationDto.filmId, updateReservationDto.userId, id);
    }
    return this.prisma.reservation.update({
      where: { id },
      data: {
        ...updateReservationDto,
        date: updateReservationDto.date ? new Date(updateReservationDto.date) : undefined,
        endDate: updateReservationDto.endDate ? new Date(updateReservationDto.endDate) : undefined,
      },
    });
  }

  async remove(id: number): Promise<Reservation> {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return this.prisma.reservation.delete({
      where: { id },
    });
  }

  private async checkForUserConflicts(startDate: Date, endDate: Date, filmId: number, userId: number, reservationId?: number): Promise<void> {
    const conflictingReservations = await this.prisma.reservation.findMany({
      where: {
        filmId,
        userId,
        AND: [
          { date: { lte: endDate } },
          { endDate: { gte: startDate } },
          reservationId ? { id: { not: reservationId } } : {},
        ],
      },
    });

    if (conflictingReservations.length > 0) {
      throw new BadRequestException('You already have a reservation for this time slot.');
    }
  }
}
