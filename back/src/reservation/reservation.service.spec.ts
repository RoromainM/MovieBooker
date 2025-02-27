import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma/prisma.service';
import { Reservation } from '@prisma/client';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';

describe('ReservationService', () => {
  let service: ReservationService;
  let prisma: PrismaService;

  const mockPrismaService = {
    reservation: {
      create: jest.fn<() => Promise<Reservation>>(),
      findMany: jest.fn<() => Promise<Reservation[]>>(),
      findUnique: jest.fn<() => Promise<Reservation | null>>(),
      update: jest.fn<() => Promise<Reservation>>(),
      delete: jest.fn<() => Promise<Reservation>>(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a reservation', async () => {
    const createReservationDto: CreateReservationDto = {
      filmId: 12345,
      date: new Date('2023-12-31T10:00:00Z'),
      endDate: new Date('2023-12-31T12:00:00Z'),
      userId: 1,
    };

    const mockReservation: Reservation = {
      id: 1,
      filmId: createReservationDto.filmId,
      date: createReservationDto.date,
      endDate: createReservationDto.endDate,
      userId: createReservationDto.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock findMany to return empty array (no conflicts)
    mockPrismaService.reservation.findMany.mockResolvedValue([]);
    mockPrismaService.reservation.create.mockResolvedValue(mockReservation);

    const reservation = await service.create(createReservationDto);

    expect(reservation).toEqual(mockReservation);
    expect(mockPrismaService.reservation.findMany).toHaveBeenCalledWith({
      where: {
        userId: createReservationDto.userId,
        filmId: createReservationDto.filmId,
        AND: [
          {
            date: { lte: createReservationDto.endDate }
          },
          {
            endDate: { gte: createReservationDto.date }
          },
          {},
        ],
      },
    });
    expect(mockPrismaService.reservation.create).toHaveBeenCalledWith({
      data: {
        filmId: createReservationDto.filmId,
        date: createReservationDto.date,
        endDate: createReservationDto.endDate,
        userId: createReservationDto.userId
      },
    });
    expect(mockPrismaService.reservation.create).toHaveBeenCalledTimes(1);
  });

  it('should throw BadRequestException when there is a conflicting reservation', async () => {
    const createReservationDto: CreateReservationDto = {
      filmId: 12345,
      date: new Date('2023-12-31T10:00:00Z'),
      endDate: new Date('2023-12-31T12:00:00Z'),
      userId: 1,
    };

    // Mock findMany to return existing reservation (conflict)
    mockPrismaService.reservation.findMany.mockResolvedValue([{
      id: 2,
      filmId: 12345,
      date: new Date('2023-12-31T11:00:00Z'),
      endDate: new Date('2023-12-31T13:00:00Z'),
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

    await expect(service.create(createReservationDto)).rejects.toThrow('You already have a reservation for this time slot.');
  });
});
