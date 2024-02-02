import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "components/Home";
import Calendar from "components/Calendar";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:year/:month" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
