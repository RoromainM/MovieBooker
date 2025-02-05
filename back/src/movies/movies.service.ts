import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { Movie } from './interface/movie.interface';
import * as dotenv from 'dotenv';

@Injectable()
export class MoviesService {
    constructor(private readonly httpService: HttpService) {}
    private readonly apiKey = process.env.API_KEY;
    private readonly baseUrl = 'https://api.themoviedb.org/3';
    private readonly logger = new Logger(MoviesService.name);

    async findAll(): Promise<Movie[]> {
        const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}`;
        const response = await firstValueFrom(
            this.httpService.get<Movie[]>(url).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response ? error.response.data : 'Unknown error');
                    throw 'An error happened!';
                })
            )
        );
        return response.data;
    }

    async findById(id: number): Promise<Movie> {
        const url = `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}`;
        const response = await firstValueFrom(
            this.httpService.get<Movie>(url).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response ? error.response.data : 'Unknown error');
                    throw 'An error happened!';
                })
            )
            );
        return response.data;
    }

    async findByTitle(title: string): Promise<Movie[]> {
        const url = `${this.baseUrl}/search/movie?query=${title}&api_key=${this.apiKey}`;
        const response = await firstValueFrom(
            this.httpService.get<Movie[]>(url).pipe(
                catchError((error: AxiosError) => {
                this.logger.error(error.response ? error.response.data : 'Unknown error');
                throw 'An error happened!';
                })
            )
        );
        return response.data;
      }

    async findByPage(page: number): Promise<Movie[]> {
        const url = `${this.baseUrl}/search/keyword?page=${page}&api_key=${this.apiKey}`;
        const response = await firstValueFrom(
            this.httpService.get<Movie[]>(url).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response ? error.response.data : 'Unknown error');
                    throw 'An error happened!';
                })
            )
        );
        return response.data;
    }

    async findAllGenres(): Promise<Movie[]> {
        const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`;
        const response = await firstValueFrom(
            this.httpService.get<Movie[]>(url).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response ? error.response.data : 'Unknown error');
                    throw 'An error happened!';
                })
            )
        );
        return response.data;
    }

    async findNowPlaying(): Promise<Movie[]> {
        const url = `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}`;
        const response = await firstValueFrom(
            this.httpService.get<Movie[]>(url).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response ? error.response.data : 'Unknown error');
                    throw 'An error happened!';
                })
            )
        );
        return response.data;
    }

    
    async getNowPlaying() : Promise<AxiosResponse<Movie[]>>{
        const url = `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}`;
        try{
            const v_movieNow = await firstValueFrom(this.httpService.get(url));
            console.log("v_movieNow = " , v_movieNow);
            if(!v_movieNow){
                throw new NotFoundException('No Film');
            }
            return v_movieNow.data;
        } catch{
            throw new BadRequestException('Error during the process');
        }
    }

}
