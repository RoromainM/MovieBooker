import React from 'react';
import './MovieCard.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  return (
    <div className="movie-card">
      <img src={posterUrl} alt={`${movie.title} poster`} className="movie-poster" />
      <div className="movie-details">
        <h2>{movie.title}</h2>
        <p>ID: {movie.id}</p>
      </div>
    </div>
  );
};

export default MovieCard;