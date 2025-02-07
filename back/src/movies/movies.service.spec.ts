import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { Movie } from './entities/movie.entity';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockHttpService = {
    get: jest.fn()
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock_api_key')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: mockHttpService
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
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
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new Error('An error happened!');
      });      

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
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new Error('An error happened!');
      });  

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
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new Error('An error happened!');
      });  

      await expect(service.findByPage(1)).rejects.toThrow('An error happened!');
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const mockMovies: Movie[] = [
        {
          id: 1,
          title: 'Test Movie',
          description: 'Test Description',
          releaseDate: new Date(),
          duration: 120,
          genre: 'Action'
        }
      ];

      const mockResponse: AxiosResponse = {
        data: mockMovies,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() }
      };

      mockHttpService.get.mockImplementation(() => of(mockResponse));

      const result = await service.findAll();
      expect(result).toEqual(mockMovies);
    });
  });
});
