// src/App.js
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Ticker from "./components/Ticker";
import Home from "./pages/Home";
import Category from "./pages/Category";
import NewsDetailPage from "./pages/NewsDetailPage";
import { VirtualData } from "./data/VirtualData";

function App() {
  return (
    <div className="app-shell">
      <Navbar categories={VirtualData.categories} />
      <Ticker items={VirtualData.ticker} />
      <Routes>
        <Route path="/" element={<Home data={VirtualData} />} />

        {/* 频道页：/channel/银河 /channel/深度 /channel/科技 ... */}
        <Route
          path="/channel/:category"
          element={<Category data={VirtualData} />}
        />

        {/* 新闻详情页：/article/:id */}
        <Route
          path="/article/:id"
          element={<NewsDetailPage data={VirtualData.headlines} />}
        />

        {/* 兜底路由（可替换成 NotFound 页面） */}
        <Route path="*" element={<Home data={VirtualData} />} />
      </Routes>
      <Footer categories={VirtualData.categories} />
    </div>
  );
}

export default App;
