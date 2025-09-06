// src/App.js
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Ticker from "./components/Ticker";
import Home from "./pages/Home";
import Category from "./pages/Category";
import { VirtualData } from "./data/virtualData";

function App() {
  return (
    <div className="app-shell">
      <Navbar categories={VirtualData.categories} />
      <Ticker items={VirtualData.ticker} />
      <Routes>
        <Route path="/" element={<Home data={VirtualData} />} />
        {/* 频道页：/channel/银河 /channel/深度 ... */}
        <Route
          path="/channel/:name"
          element={<Category data={VirtualData} />}
        />
        {/* 兜底：可以做 404 */}
        <Route path="*" element={<Home data={VirtualData} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
