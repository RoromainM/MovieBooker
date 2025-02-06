import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
}

interface ReservationFormProps {
  onReservationSuccess: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onReservationSuccess }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<{ results: Movie[] }>('http://localhost:3000/movies');
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedMovie && date && time) {
      try {
        await axios.post('http://localhost:3000/reservations', {
          movieId: selectedMovie,
          date,
          time,
        });
        onReservationSuccess();
      } catch (error) {
        console.error('Error making reservation:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="movie">Select Movie:</label>
        <select
          id="movie"
          value={selectedMovie ?? ''}
          onChange={(e) => setSelectedMovie(Number(e.target.value))}
          required
        >
          <option value="" disabled>Select a movie</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="time">Select Time:</label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <button type="submit">Make Reservation</button>
    </form>
  );
};

export default ReservationForm;