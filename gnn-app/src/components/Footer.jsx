import { NavLink } from "react-router-dom";
import "./Footer.css";

const DEFAULT_CATEGORIES = ["银河", "深度", "科技", "经济", "文化"];

export default function Footer({ categories = [] }) {
  const cats = categories.length ? categories : DEFAULT_CATEGORIES;

  return (
    <footer className="footer">
      <div className="container-wide footer-grid">
        {/* 品牌 & 简介 */}
        <div>
          <div className="footer-brand">
            <span className="brand-badge">GNN</span>
            <span className="brand-subtitle">Galactic News Network</span>
          </div>
          <p className="footer-desc">
            群星宇宙的权威新闻与分析。为银河居民带来最快、最广的星际资讯。
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} Galactic News Network. All rights reserved.
          </p>
        </div>

        {/* 栏目 */}
        <div>
          <h4 className="footer-title">栏目</h4>
          <ul className="footer-list">
            {cats.map((c) => (
              <li key={c}>
                <NavLink
                  to={`/channel/${encodeURIComponent(c)}`}
                  className={({ isActive }) =>
                    isActive ? "footer-link active" : "footer-link"
                  }
                  end
                >
                  {c}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* 关于 */}
        <div>
          <h4 className="footer-title">关于</h4>
          <ul className="footer-list">
            <li><NavLink className="footer-link" to="/about/editorial">编辑部</NavLink></li>
            <li><NavLink className="footer-link" to="/about/terms">使用条款</NavLink></li>
            <li><NavLink className="footer-link" to="/about/privacy">隐私政策</NavLink></li>
            <li><NavLink className="footer-link" to="/about/contact">联系我们</NavLink></li>
          </ul>
        </div>

        {/* 社交媒体（外链） */}
        <div>
          <h4 className="footer-title">关注我们</h4>
          <ul className="footer-list">
            <li><a className="footer-link" href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
            <li><a className="footer-link" href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a></li>
            <li><a className="footer-link" href="https://discord.com" target="_blank" rel="noreferrer">Discord</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
