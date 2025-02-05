import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './interface/reservation.interface';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    return this.prisma.reservation.create({
      data: createReservationDto,
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
      throw new Error(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    return this.prisma.reservation.update({
      where: { id },
      data: updateReservationDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number): Promise<Reservation> {
    return this.prisma.reservation.delete({
      where: { id },
    });
  }
}
