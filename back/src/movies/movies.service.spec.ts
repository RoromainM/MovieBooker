import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { Movie } from './interface/movie.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a movie by id', async () => {
      const result: AxiosResponse<Movie> = { data: {} as Movie, status: 200, statusText: 'OK', headers: {}, config: { headers: new AxiosHeaders({ 'Content-Type': 'application/json' }) } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(result));

      expect(await service.findById(1)).toBe(result.data);
    });

    it('should throw an error if the request fails', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('An error happened!')));

      await expect(service.findById(1)).rejects.toThrow('An error happened!');
    });
  });

  describe('findByTitle', () => {
    it('should return an array of movies by title', async () => {
      const result: AxiosResponse<Movie[]> = { data: [], status: 200, statusText: 'OK', headers: {}, config: { headers: new AxiosHeaders({ 'Content-Type': 'application/json' }) } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(result));

      expect(await service.findByTitle('title')).toBe(result.data);
    });

    it('should throw an error if the request fails', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('An error happened!')));

      await expect(service.findByTitle('title')).rejects.toThrow('An error happened!');
    });
  });

  describe('findByPage', () => {
    it('should return an array of movies by page', async () => {
      const result: AxiosResponse<Movie[]> = { data: [], status: 200, statusText: 'OK', headers: {}, config: { headers: new AxiosHeaders({ 'Content-Type': 'application/json' }) } };
      jest.spyOn(httpService, 'get').mockReturnValue(of(result));

      expect(await service.findByPage(1)).toBe(result.data);
    });

    it('should throw an error if the request fails', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('An error happened!')));

      await expect(service.findByPage(1)).rejects.toThrow('An error happened!');
    });
  });
});
