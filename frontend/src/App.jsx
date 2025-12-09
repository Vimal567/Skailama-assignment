import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import EventsPage from './pages/EventsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/events/:role" element={<EventsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
