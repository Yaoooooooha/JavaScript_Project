import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import "./styles/app.css";
import Card from "./pages/Card";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 第一層 Route 裡面放 Layout component 作為 nav */}
        <Route path="/" element={<Layout />}>
          {/* 就是 slash 的意思 */}
          <Route index element={<HomePage />}></Route>
          <Route path="card" element={<Card />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
