import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Calendar from './components/Calendar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:year/:month" element={ <Calendar /> } />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
