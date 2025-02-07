import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { NotFoundException } from '@nestjs/common';
import { Reservation } from '@prisma/client';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [{
        provide: ReservationService,
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
        },
      }],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    jest.spyOn(service, 'create').mockResolvedValue(mockReservation);

    expect(await controller.create(createReservationDto)).toEqual(mockReservation);
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
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Reservation with ID 1 not found'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call ReservationService.update with correct parameters', async () => {
      const updateReservationDto: UpdateReservationDto = { 
        date: new Date('2023-12-31T23:59:59Z'),
        endDate: new Date('2024-01-01T01:59:59Z'),
        userId: 1, 
        filmId: 12345 
      };
      const mockUpdatedReservation: Reservation = {
        id: 1,
        filmId: updateReservationDto.filmId!,
        date: updateReservationDto.date!,
        endDate: updateReservationDto.endDate!,
        userId: updateReservationDto.userId!,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedReservation);
      await controller.update('1', updateReservationDto);
      expect(service.update).toHaveBeenCalledWith(1, updateReservationDto);
    });

    it('should throw an error if reservation not found', async () => {
      const updateReservationDto: UpdateReservationDto = { 
        date: new Date('2023-12-31T23:59:59Z'),
        endDate: new Date('2024-01-01T01:59:59Z')
      };
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());
      
      await expect(controller.update('1', updateReservationDto))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call ReservationService.remove with correct parameters', async () => {
      const mockDeletedReservation: Reservation = {
        id: 1,
        filmId: 12345,
        date: new Date(),
        endDate: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      jest.spyOn(service, 'remove').mockResolvedValue(mockDeletedReservation);
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an error if reservation not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
      
      await expect(controller.remove('1'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
