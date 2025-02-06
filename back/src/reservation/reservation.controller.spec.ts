import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { NotFoundException } from '@nestjs/common';
import { Reservation } from '@prisma/client';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn().mockResolvedValue({ id: 1, date: new Date(), endDate: new Date(), createdAt: new Date(), updatedAt: new Date(), userId: 1, filmId: 12345 } as Reservation),
            update: jest.fn().mockResolvedValue({ id: 1, date: new Date(), endDate: new Date(), createdAt: new Date(), updatedAt: new Date(), userId: 1, filmId: 12345 } as Reservation),
            remove: jest.fn().mockResolvedValue({ id: 1, date: new Date(), endDate: new Date(), createdAt: new Date(), updatedAt: new Date(), userId: 1, filmId: 12345 } as Reservation),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call ReservationService.create with correct parameters', async () => {
      const createReservationDto: CreateReservationDto = { date: new Date('2023-12-31T10:00:00Z'), endDate: new Date('2023-12-31T12:00:00Z'), userId: 1, filmId: 12345 };
      await controller.create(createReservationDto);
      expect(service.create).toHaveBeenCalledWith(createReservationDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of reservations', async () => {
      const result = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by ID', async () => {
      const result = { id: 1, date: new Date(), endDate: new Date(), createdAt: new Date(), updatedAt: new Date(), userId: 1, filmId: 12345 } as Reservation;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await controller.findOne('1')).toBe(result);
    });

    it('should throw an error if reservation not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(controller.findOne('1')).rejects.toThrow(new NotFoundException('Reservation with ID 1 not found'));
    });
  });

  describe('update', () => {
    it('should call ReservationService.update with correct parameters', async () => {
      const updateReservationDto: UpdateReservationDto = { date: new Date('2023-12-31T23:59:59Z'), userId: 1, filmId: 12345 };
      await controller.update('1', updateReservationDto);
      expect(service.update).toHaveBeenCalledWith(1, updateReservationDto);
    });

    it('should throw an error if reservation not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);
      await expect(controller.update('1', {} as UpdateReservationDto)).rejects.toThrow(new NotFoundException('Reservation with ID 1 not found'));
    });
  });

  describe('remove', () => {
    it('should call ReservationService.remove with correct parameters', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an error if reservation not found', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(null);
      await expect(controller.remove('1')).rejects.toThrow(new NotFoundException('Reservation with ID 1 not found'));
    });
  });
});
