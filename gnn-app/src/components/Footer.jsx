import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
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
            <li><a href="#">银河</a></li>
            <li><a href="#">深度</a></li>
            <li><a href="#">科技</a></li>
            <li><a href="#">经济</a></li>
            <li><a href="#">文化</a></li>
          </ul>
        </div>

        {/* 关于 */}
        <div>
          <h4 className="footer-title">关于</h4>
          <ul className="footer-list">
            <li><a href="#">编辑部</a></li>
            <li><a href="#">使用条款</a></li>
            <li><a href="#">隐私政策</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>

        {/* 社交媒体 */}
        <div>
          <h4 className="footer-title">关注我们</h4>
          <ul className="footer-list">
            <li><a href="#">Twitter</a></li>
            <li><a href="#">YouTube</a></li>
            <li><a href="#">Discord</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
