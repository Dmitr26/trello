import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Authorization } from './pages/Authorization/Authorization';
import { Login } from './pages/Authorization/components/Login';
import { Registration } from './pages/Authorization/components/Registration';
import { MainRoute } from './pages/MainRoute';
import { Home } from './pages/Home/Home';
import { Board } from './pages/Board/Board';
import { store } from './common/store/store';
import { ToastContainer } from 'react-toastify';
import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route element={<MainRoute />}>
          <Route index path="/" element={<Home />} />
          <Route path="/board/:board_id" element={<Board />} />
          <Route path="/board/:board_id/card/:card_id" element={<Board />} />
        </Route>
        <Route element={<Authorization />}>
          <Route index path="/login" element={<Login />} />
          <Route index path="/registration" element={<Registration />} />
        </Route>
      </Routes>
      <ToastContainer />
    </ Provider>
  );
}

export default App;
