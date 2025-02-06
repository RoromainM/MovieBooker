import React, { useState } from 'react';
import MovieCarousel from './components/MovieCarousel/MovieCarousel';
import ReservationForm from './components/ReservationForm/ReservationForm';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import './App.css';

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState<boolean>(false);

  const handleLoginSuccess = (username: string) => {
    setUsername(username);
    setShowRegister(false);
  };

  const handleRegisterSuccess = (username: string) => {
    setUsername(username);
    setShowRegister(false);
  };

  const handleReservationSuccess = () => {
    alert('Reservation made successfully!');
  };

  const handleLogout = () => {
    setUsername(null);
  };

  return (
    <div className="App">
      <h1>Movie Booker</h1>
      {username ? (
        <>
          <p>Welcome, {username}!</p>
          <button onClick={handleLogout}>Logout</button>
          <h2>Movie Carousel</h2>
          <MovieCarousel />
          <h2>Make a Reservation</h2>
          <ReservationForm onReservationSuccess={handleReservationSuccess} />
        </>
      ) : (
        <>
          <h2>{showRegister ? 'Register' : 'Login'}</h2>
          {showRegister ? (
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
          ) : (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          )}
          <button onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </>
      )}
    </div>
  );
};

export default App;
