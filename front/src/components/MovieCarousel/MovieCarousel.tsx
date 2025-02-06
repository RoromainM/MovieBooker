import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import MovieCard from '../MovieCard/MovieCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
}

const MovieCarousel: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<{ results: Movie[] }>('http://localhost:3000/movies');
        console.log('Movies fetched:', response.data.results);
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {movies.map((movie) => (
        <div key={movie.id}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </Slider>
  );
};

export default MovieCarousel;