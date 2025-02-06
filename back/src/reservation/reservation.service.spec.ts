import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { NotFoundException } from '@nestjs/common';
import { Reservation } from '@prisma/client';

describe('ReservationService', () => {
  let service: ReservationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: {
            reservation: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new reservation', async () => {
      const createReservationDto: CreateReservationDto = { date: new Date('2023-12-31T10:00:00Z'), endDate: new Date('2023-12-31T12:00:00Z'), userId: 1, filmId: 12345 };
      const result = { id: 1, ...createReservationDto, createdAt: new Date(), updatedAt: new Date() } as Reservation;

      jest.spyOn(prisma.reservation, 'create').mockResolvedValue(result);

      expect(await service.create(createReservationDto)).toBe(result);
      expect(prisma.reservation.create).toHaveBeenCalledWith({ data: createReservationDto });
    });
  });

  describe('findAll', () => {
    it('should return an array of reservations', async () => {
      const result = [];
      jest.spyOn(prisma.reservation, 'findMany').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by ID', async () => {
      const result = { id: 1, date: new Date(), endDate: new Date(), createdAt: new Date(), updatedAt: new Date(), userId: 1, filmId: 12345 } as Reservation;
      jest.spyOn(prisma.reservation, 'findUnique').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });

    it('should throw an error if reservation not found', async () => {
      jest.spyOn(prisma.reservation, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(new NotFoundException('Reservation with ID 1 not found'));
    });
  });

  describe('update', () => {
    it('should update a reservation', async () => {
      const updateReservationDto: UpdateReservationDto = { date: new Date('2023-12-31T23:59:59Z'), userId: 1, filmId: 12345 };
      const result = { id: 1, ...updateReservationDto, createdAt: new Date(), updatedAt: new Date() } as Reservation;

      jest.spyOn(prisma.reservation, 'findUnique').mockResolvedValue(result);
      jest.spyOn(prisma.reservation, 'update').mockResolvedValue(result);

      expect(await service.update(1, updateReservationDto)).toBe(result);
      expect(prisma.reservation.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateReservationDto, include: { user: true } });
    });

    it('should throw an error if reservation not found', async () => {
      jest.spyOn(prisma.reservation, 'findUnique').mockResolvedValue(null);

      await expect(service.update(1, {} as UpdateReservationDto)).rejects.toThrow(new NotFoundException('Reservation with ID 1 not found'));
    });
  });

  describe('remove', () => {
    it('should remove a reservation', async () => {
      const result = { id: 1, date: new Date(), endDate: new Date(), createdAt: new Date(), updatedAt: new Date(), userId: 1, filmId: 12345 } as Reservation;

      jest.spyOn(prisma.reservation, 'findUnique').mockResolvedValue(result);
      jest.spyOn(prisma.reservation, 'delete').mockResolvedValue(result);

      expect(await service.remove(1)).toBe(result);
      expect(prisma.reservation.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if reservation not found', async () => {
      jest.spyOn(prisma.reservation, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(new NotFoundException('Reservation with ID 1 not found'));
    });
  });
});
