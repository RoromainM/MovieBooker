import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { of } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { Movie } from './interface/movie.interface';

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
            findAll: jest.fn().mockReturnValue(of([])),
            findById: jest.fn().mockReturnValue(of({})),
            findByPage: jest.fn().mockReturnValue(of([])),
            findByTitle: jest.fn().mockReturnValue(of([])),
            findAllGenres: jest.fn().mockReturnValue(of([])),
            getNowPlaying: jest.fn().mockReturnValue(of([])),
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
      const result = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      const res = { json: jest.fn() };
      await controller.findAll(res);
      expect(res.json).toHaveBeenCalledWith(result);
    });
  });

  describe('findById', () => {
    it('should return a movie by id', async () => {
      const result: Movie = { id: 1, title: 'Test Movie', description: 'Test Description', genre: 'Test Genre', releaseDate: new Date() };
      jest.spyOn(service, 'findById').mockResolvedValue(result);
      const res = { json: jest.fn() };
      await controller.findById(res, 1);
      expect(res.json).toHaveBeenCalledWith(result);
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
      const result: AxiosResponse<Movie[]> = { data: [], status: 200, statusText: 'OK', headers: new AxiosHeaders(), config: { headers: new AxiosHeaders() } };
      jest.spyOn(service, 'getNowPlaying').mockReturnValue(of(result).toPromise() as Promise<AxiosResponse<Movie[]>>);
      expect(await controller.getAllNowPlaying()).toBe(result);
    });
  });
});
