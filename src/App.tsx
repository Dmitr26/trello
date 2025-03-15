import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Board } from './pages/Board/Board';
import './App.scss';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board/:board_id" element={<Board />} />
    </Routes>
  );
}

export default App;
