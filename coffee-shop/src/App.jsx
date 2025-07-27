import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
//import About from './pages/About';
//import Contact from './pages/Contact';
import './layout.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <h1>☕ Cozy Coffee</h1>
          <nav>
            <Link to="/">主页</Link>
            <Link to="/menu">菜单</Link>
            <Link to="/about">关于我们</Link>
            <Link to="/contact">联系我们</Link>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            {/*<Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />*/}
          </Routes>
        </main>
        <footer className="footer">
          <p>© 2025 Cozy Coffee. 保留所有权利.</p>
          <p>由 React & Lucide Icons 构建 · 仅供学习练习用途</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
