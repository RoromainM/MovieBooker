import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { MoviesService } from './movies.service';
import * as CircularJSON from 'circular-json';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';
import { Movie } from './interface/movie.interface';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

    @Get()
    async findAll(@Res() res) {
        try {
            const movies = await this.moviesService.findAll();
            res.json(JSON.parse(CircularJSON.stringify(movies)));
        } catch (error) {
            res.status(500).json({ message: 'Error fetching movies', error });
        }
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'Get movie by id', type: Number, required: true })
    async findById(@Res() res, @Param('id') id: number) {
        try {
            const movie = await this.moviesService.findById(id);
            res.json(JSON.parse(CircularJSON.stringify(movie)));
        } catch (error) {
            res.status(500).json({ message: 'Error fetching movie', error });
        }
    }

    @Get(':page')
    async findByPage(@Res() res, @Param('page') page: number) {
        try {
            const movies = await this.moviesService.findByPage(page);
            res.json(JSON.parse(CircularJSON.stringify(movies)));
        } catch (error) {
            res.status(500).json({ message: 'Error fetching movies', error });
        }
    }

    @Get('search/:title')
    @ApiQuery({ name: 'title', description: 'Search movie by title', type: String, required: true })
    async findByTitle(@Res() res, @Query('title') title: string) {
        try {
        const movies = await this.moviesService.findByTitle(title);
        res.json(JSON.parse(CircularJSON.stringify(movies)));
        } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error });
        }
    }

    @Get('genre/list')
    async getGenres(@Res() res) {
        try {
            const genres = await this.moviesService.findAllGenres();
            res.json(JSON.parse(CircularJSON.stringify(genres)));
        } catch (error) {
            res.status(500).json({ message: 'Error fetching genres', error });
        }
    }

    // @Get('now_playing')
    // async getNowPlaying(@Res() res) {
    //     try {
    //         const nowPlaying = await this.moviesService.findNowPlaying();
    //         res.json(JSON.parse(CircularJSON.stringify(nowPlaying)));
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error fetching now playing movies', error });
    //     }
    // }

    @Get('now_playing')
    @ApiOperation({ summary: 'lister tous les genres de films du moment' })
    async getAllNowPlaying(): Promise<AxiosResponse<Movie[]>> {
        console.log('get all now playing');
        return this.moviesService.getNowPlaying();
    }
}
