import React from 'react';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <img src={movie.posterUrl} alt={`${movie.title} poster`} className="movie-poster" />
      <div className="movie-details">
        <h2>{movie.title}</h2>
        <p>ID: {movie.id}</p>
      </div>
    </div>
  );
};

export default MovieCard;