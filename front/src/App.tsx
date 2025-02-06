import React from 'react';
import MovieCarousel from './components/MovieCarousel/MovieCarousel';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Movie Carousel</h1>
      <MovieCarousel />
    </div>
  );
};

export default App;
