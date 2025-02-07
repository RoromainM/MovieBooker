import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';  // Update this import
import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByPage: jest.fn(),
            findByTitle: jest.fn(),
            findAllGenres: jest.fn(),
            getNowPlaying: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result: Movie[] = [{
        id: 1,
        title: 'Test Movie',
        description: 'Test Description',
        genre: 'Action',
        releaseDate: new Date('2025-02-07T08:54:04.001Z').toISOString() as unknown as Date,
        duration: 120
      }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      const res = { json: jest.fn() };
      await controller.findAll(res);
      expect(res.json).toHaveBeenCalledWith(result);
    });
  });

  describe('findById', () => {
    it('should return a movie by id', async () => {
      const mockMovie: Movie = {
        id: 1,
        title: 'Test Movie',
        description: 'Test Description',
        genre: 'Test Genre',
        releaseDate: new Date('2025-02-07T08:28:50.713Z').toISOString() as unknown as Date,
        duration: 120
      };

      jest.spyOn(service, 'findById').mockResolvedValue(mockMovie);

      const res = { json: jest.fn() };
      await controller.findById(res, 1);
      expect(res.json).toHaveBeenCalledWith(mockMovie);
    });
  });

  describe('findByPage', () => {
    it('should return an array of movies by page', async () => {
      const result = [];
      jest.spyOn(service, 'findByPage').mockResolvedValue(result);
      const res = { json: jest.fn() };
      await controller.findByPage(res, 1);
      expect(res.json).toHaveBeenCalledWith(result);
    });
  });

  describe('findByTitle', () => {
    it('should return an array of movies by title', async () => {
      const result = [];
      jest.spyOn(service, 'findByTitle').mockResolvedValue(result);
      const res = { json: jest.fn() };
      await controller.findByTitle(res, 'title');
      expect(res.json).toHaveBeenCalledWith(result);
    });
  });

  describe('getGenres', () => {
    it('should return an array of genres', async () => {
      const result = [];
      jest.spyOn(service, 'findAllGenres').mockResolvedValue(result);
      const res = { json: jest.fn() };
      await controller.getGenres(res);
      expect(res.json).toHaveBeenCalledWith(result);
    });
  });

  describe('getAllNowPlaying', () => {
    it('should return an array of now playing movies', async () => {
      const mockMovies: AxiosResponse<Movie[]> = {
        data: [{ id: 1, title: 'Test Movie', description: 'Test Description', genre: 'Test Genre', releaseDate: new Date(), duration: 120 }],
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' } as unknown as AxiosRequestHeaders,
        config: { headers: { 'content-type': 'application/json' } as unknown as AxiosRequestHeaders },
      };
      jest.spyOn(service, 'getNowPlaying').mockResolvedValue(mockMovies);
      
      const result = await controller.getAllNowPlaying();
      expect(result).toEqual(mockMovies);
    });
  });
});
